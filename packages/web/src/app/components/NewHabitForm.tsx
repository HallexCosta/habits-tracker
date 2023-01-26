import * as CheckBox from "@radix-ui/react-checkbox"
import { Check } from "phosphor-react"
import { FormEvent, useState } from "react"
import { api } from "../../lib/axios"

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feirta',
  'Sexta-feira',
  'Sábado'
]

export function NewHabitForm() {
  const [weekDays, setWeekDays] = useState<number[]>([])
  const [title, setTitle] = useState('')

  async function createNewHabit(event: FormEvent) {
    event.preventDefault()
    console.log('sendTitle', title)
    console.log('sendWeekDays', weekDays)

    if (!title || weekDays.length === 0) 
      return alert('Porfavor preencha o titulo e escolha pelo menos 1 dia da semana')

    await api.post('/habits', {
      title,
      weekDays
    })

    alert('Hábito criado com sucesso!')
    setTitle('')
    setWeekDays([])
  }

  function handleToggleCheckBox(currentWeekDay: number) {
    setWeekDays(prevWeekDay =>  {
      const weekDays = [...prevWeekDay]

      if (weekDays.includes(currentWeekDay)) {
        return weekDays.filter(weekDay => weekDay !== currentWeekDay)
      }

      weekDays.push(currentWeekDay)
      return weekDays
    })
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu compromentimento?
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-[#09090A]"
        value={title}
        autoFocus
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="mt-3 flex flex-col gap-2">
        {availableWeekDays.map((weekDay, index) => (
          <CheckBox.Root 
            key={weekDay}
            className="flex flex-row items-center gap-3 group focus:outline-none" 
            checked={weekDays.includes(index)}
            onCheckedChange={handleToggleCheckBox.bind(null, index)}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border bg-zinc-800 border-zinc-900 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-all group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900"
            >
              <CheckBox.Indicator>
                <Check 
                  className="text-white"
                  size={24} 
                />
              </CheckBox.Indicator>

            </div>

            <span 
              className="leading-tight font-medium"
            >
              {weekDay}
            </span>
          </CheckBox.Root>
        ))}
      </div>

      <button 
        type="submit" 
        className="mt-6 rounded-lg p-4 gap-3 flex items-center justify-center font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check size={20} />

        Confirmar
      </button>
    </form>
  )
}
