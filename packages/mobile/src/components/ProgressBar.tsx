import clsx from 'clsx'
import {View} from 'react-native'

interface Props {
  progress: number
}

export function ProgressBar({ progress = 0 }: Props) {
  return (
    <View className="w-full h-3 bg-zinc-700 rounded-xl mt-4">
      <View 
        className="h-3 bg-violet-500 rounded-lg"
        style={{ width: `${progress}%` }}
      />
    </View>
  )
}
