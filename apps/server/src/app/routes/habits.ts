import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'

import { handleAuthenticate } from '../helpers/utils'

import { prisma } from '../../lib/prisma'

type UserSummaryDay = {
  amount: number
  completed: number
  userId: string
  date: Date
}

export function habitsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return "I'm alive!"
  })

  app.post('/habits', async (request, reply) => {
    try {
      const { uid } = await handleAuthenticate(request.headers.authorization)

      if (!uid) {
        throw new Error(
          '[Unathorized]: need token from firebase to register user'
        )
      }

      const createHabitBody = z.object({
        title: z.string(),
        weekDays: z.array(z.number().min(0).max(6)),
        userId: z.string(),
      })

      const { userId, title, weekDays } = createHabitBody.parse(request.body)

      const userExists = await prisma.user.findFirst({
        where: {
          id: userId,
          userDetails: {
            firebase_uid: uid,
          },
        },
      })
      if (!userExists) {
        throw new Error(
          'User not found or firebase uid not corresponding with this user'
        )
      }

      const today = dayjs().startOf('day').toDate()

      reply.status(201)

      return await prisma.habit.create({
        data: {
          user_id: userId,
          title,
          created_at: today,
          weekDays: {
            create: weekDays.map((weekDay) => ({ week_day: weekDay })),
          },
        },
      })
    } catch (e) {
      reply.status(401)
      console.log(e)
      return {
        message: e.message,
      }
    }
  })

  app.get('/days', async (request, reply) => {
    const { email } = await handleAuthenticate(request.headers.authorization)

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        throw new Error(`User with email "${email}" not found`)
      }

      const listDayQuery = z.object({
        date: z.coerce.date(),
      })

      const { date } = listDayQuery.parse(request.query)

      const parsedDate = dayjs(date).startOf('day')
      const weekDay = parsedDate.get('day')

      // todos os habitos possiveis naquele dia
      const possibleHabits = await prisma.habit.findMany({
        where: {
          created_at: {
            lte: date,
          },
          weekDays: {
            some: {
              week_day: weekDay,
            },
          },
          user_id: user.id,
        },
        orderBy: [
          {
            created_at: 'desc',
          },
        ],
      })

      console.log(
        await prisma.$queryRaw`
          SELECT
            habits.id as habitId
          FROM habits
          LEFT JOIN users
            ON users.id = habits.user_id
          LEFT JOIN day_users
            ON day_users.user_id = users.id
          LEFT JOIN days
            ON days.id = day_users.day_id
            AND days.date = ${parsedDate.toDate()}
          LEFT JOIN day_habits
            ON day_habits.day_id = days.id
            AND day_habits.habit_id = habits.id
          WHERE users.id = ${user.id}
            AND day_habits.habit_id IS NOT NULL
        `
      )
      const day = await prisma.day.findUnique({
        where: {
          date: parsedDate.toDate(),
        },
        include: {
          dayHabits: {
            include: {
              habit: true,
            },
          },
        },
      })

      // habitos que já foram completados - de um usuário especifico
      const completedHabits =
        day?.dayHabits
          .filter((dayHabit) => dayHabit.habit.user_id === user.id)
          .map((dayHabit) => dayHabit.habit_id) ?? []

      return {
        possibleHabits,
        completedHabits,
      }
    } catch (e) {
      console.log(e)
      reply.status(400)
      return {
        message: e.message,
      }
    }
  })

  // completar / não-completar um hábito
  app.patch('/habits/:id/toggle', async (request, reply) => {
    const { email } = await handleAuthenticate(request.headers.authorization)

    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleHabitParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      reply.status(400)
      return {
        message: 'Ops.. user not found',
      }
    }

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
          dayUsers: {
            create: {
              user_id: user.id,
            },
          },
        },
      })
    }

    // vinculando hábito ao dia
    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    })

    if (dayHabit) {
      //remover a marcação de completo
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        },
      })
    } else {
      // completar o hábito neste dia
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      })
    }
  })

  app.get('/summary', async (request, reply) => {
    const userAuth = await handleAuthenticate(request.headers.authorization)

    if (!userAuth) {
      reply.status(400)
      return {
        message: 'User firebase no is valid',
      }
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: userAuth.email,
        },
      })

      if (!user) {
        throw new Error(`User with email "${userAuth.email}" not found`)
      }

      async function defaultUserSummaryDays(userId: string, date: Date) {
        const weekDay = dayjs(date).day()
        const summary = await prisma.$queryRaw`
          SELECT 
            users.id as userId,
            (
              SELECT 
              cast(count(habit_week_days.id) as float) as amount
              FROM habit_week_days
                JOIN habits
                JOIN users
              WHERE 
                habit_week_days.habit_id = habits.id            
                AND habit_week_days.week_day = ${weekDay}
                AND users.id = ${user.id} 
            ) as amount,
            (
              SELECT 
                cast(count(day_habits.id) as float) as amount
              FROM day_habits
              WHERE 
                day_habits.habit_id = habits.id
                AND habits.user_id = users.id
            ) as completed
          FROM users
          LEFT JOIN habits
            ON habits.user_id = users.id
          WHERE
            users.id = ${user.id}
        `
        console.log(summary)

        return [
          {
            ...summary[0],
            date,
          },
        ]
      }
      console.log(user.id)
      // listar os habitos de cada dia, forma quantitativa
      // [ { date: '16/05', amount: 5, completed: 1, userId: 'UUID' } ]
      const today = dayjs(new Date()).startOf('day').toDate()
      const todayInTimestamp = +today
      console.log(today, todayInTimestamp)
      const userSummaryDays = await prisma.$queryRaw<UserSummaryDay[]>`
        SELECT 
          users.id as userId,
          coalesce(
            cast(to_char(days.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as date),
            -- return date to from javascript in format "YYYY-MM-DDTHH:MM:SS.SSS" if "days.date" is null
            ${today}
          ) as date,
          (
            SELECT 
              cast(count(habit_week_days.id) as float)
            FROM habit_week_days
            JOIN habits 
                ON habit_week_days.habit_id = habits.id 
            WHERE habit_week_days.habit_id = habits.id            
            AND (
              -- using date from days table to find habits from weekDay
              habit_week_days.week_day = extract(dow from days.date)
              -- using current date to find habits from weekDay
              OR habit_week_days.week_day = extract(dow from ${today}::date)
            )
            AND habits.created_at <= ${today}
          ) as amount,
          (
            SELECT 
              cast(count(day_habits.id) as float)
            FROM day_habits
            JOIN habits
              ON habits.user_id = users.id
              AND habits.id = day_habits.habit_id
            WHERE day_habits.habit_id = habits.id
          ) as completed
          FROM users
          LEFT JOIN day_users
            ON day_users.user_id = users.id
          LEFT JOIN days
            ON days.id = day_users.day_id
          WHERE 
            users.id = ${user.id}
          ORDER BY days.date desc
      `

      return userSummaryDays
    } catch (e) {
      console.log(e)
      reply.status(400)
      return {
        messsge: e.message,
      }
    }
  })
}
