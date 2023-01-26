import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'
import { prisma } from '../lib/prisma'

export async function appRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return "I'm alive!"
  })

  app.post('/habits', async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    })

    const { title, weekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()


    return await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => ({ week_day: weekDay }))
        }
      }
    })
  })

  app.get('/days', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })

    const { date } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')
    
    // todos os habitos possiveis naquele dia
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      },
      orderBy: [
        {
          created_at: 'desc'
        }
      ]
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate()
      },
      include: {
        dayHabits: true
      }
    })

    // habitos que ja foram completados
    const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.habit_id) ?? []

    return {
      possibleHabits,
      completedHabits
    }
  })

  // completar / não-completar um hábito
  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid()
    })
    const { id } = toggleHabitParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }
    console.log(day)

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    })
    console.log(dayHabit)

    if (dayHabit) {
      //remover a marcação de completo
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })
      return
    }

    // completar o hábito neste dia
    await prisma.dayHabit.create({
      data: {
        day_id: day.id,
        habit_id: id
      }
    })
  })

  app.get('/summary', async () => {
    // [ { date: '16/05', amount: 5, completed: 1 } ]
    return await prisma.$queryRaw`
      SELECT 
        D.date,
        D.id,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT 
            cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE 
            HWD.week_day = cast(strftime('%w', D.date / 1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D
      ORDER BY D.date desc
    `
  })
}
