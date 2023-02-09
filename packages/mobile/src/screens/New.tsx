import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { BackButton } from '../components/BackButton'
import { CheckBox } from '../components/CheckBox'
import { api } from '../lib/axios'

import colors from 'tailwindcss/colors'

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feirta',
  'Sexta-feira',
  'Sábado'
]

export function New() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  function resetFields() {
    setTitle('')
    setWeekDays([])
  }
  async function handleCreateNewHabit() {
    try {
      if (!title) return Alert.alert('Novo hábito', 'Informe o nome do hábito')
      if (!(weekDays.length > 0)) return Alert.alert('Dias da semanas', 'Escolha pelo menos 1 dia da semana')

      await api.post('/habits', { title, weekDays })
      Alert.alert('Successo', 'Novo hábito criado')

      resetFields()
    } catch (e) {
      Alert.alert('Ops', 'Houve algum problema ao tentar criar o hábito. Tente novamente')
    }
  }

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex)) 
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Ex: exercícios, dormir bem, etc"
          onChangeText={setTitle}
          value={title}
          placeholderTextColor={colors.zinc[400]}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência
        </Text>

        {availableWeekDays.map((weekDay, index) => (
          <CheckBox 
            key={weekDay}
            title={weekDay}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={.7}
          onPress={handleCreateNewHabit}
        >
          <Feather
            name="check"
            size={20}
            color={colors.white}
          />

          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

