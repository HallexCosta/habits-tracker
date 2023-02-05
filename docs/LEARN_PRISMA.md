### Convert Prisma to Pure SQL Raw

#### Prisma Structure

```js
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
    .filter((dayHabit) => dayHabit.habit.user_id === userId)
    .map((dayHabit) => dayHabit.habit_id) ?? []

console.log(completedHabits)
```

#### SQL Raw Statment

1. A tabela `habits` é selecionada.
   1.1 O ID dos hábitos é retornado como `habitId`.
2. Utiliza-se um join com a tabela users
   2.1 O relacionamento é estabelecido entre a tabela `habits` e a tabela `users` com base no id de cada usuário.
3. Utiliza-se um segundo join com a tabela `user_days`.
   3.1 O relacionamento é estabelecido entre as tabelas users e `user_days` com base no id de cada usuário.
4. Utiliza-se um terceiro join com a tabela `days`.
   4.1 O relacionamento é estabelecido entre as tabelas `user_days` e `days` com base no id dos dias.
   4.2 Verifica-se se a data especificada corresponde à data presente na tabela `days`.
5. Utiliza-se um quarto join com a tabela `day_habits`.
   5.1 O relacionamento é estabelecido entre as tabelas `days` e `day_habits` com base no id dos dias.
   5.2 Verifica-se se o hábito presente na tabela `day_habits` corresponde ao hábito na tabela `habits`.
6. Utiliza-se uma cláusula `WHERE` para selecionar apenas o usuário especificado pelo `userId`.
   6.1 Verifica-se se o hábito selecionado na tabela `day_habits` é diferente de `NULL`.

Por fim a query retorna o ID de todos os hábitos relacionados ao usuário especificado em um dia específico, e que foi completado naquele dia, ou seja, o dado dedve existir na tabela `day_habits`.

```js
const completedHabits = await prisma.$queryRaw`
  SELECT
    habits.id as habitId
  FROM habits
  LEFT JOIN users
    ON users.id = habits.user_id
  LEFT JOIN user_days
    ON user_days.user_id = users.id
  LEFT JOIN days
    ON days.id = user_days.day_id
    AND days.date = ${parsedDate.toDate()}
  LEFT JOIN day_habits
    ON day_habits.day_id = days.id
    AND day_habits.habit_id = habits.id
  WHERE users.id = ${userId}
    AND day_habits.habit_id IS NOT NULL
`
const completedHabitsId = completedHabits.map((habit) => habit.habitId)
console.log(completedHabitsId)
```
