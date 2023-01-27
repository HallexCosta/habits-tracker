import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { View } from 'react-native'
import { useEffect } from 'react'

interface Props {
  progress: number
}

export function ProgressBar({ progress = 0 }: Props) {
  const sharedProgress = useSharedValue(progress)

  const animtedProgress = useAnimatedStyle(() => {
    return {
      width: `${sharedProgress.value}%`
    }
  })

  useEffect(() => {
    sharedProgress.value = withTiming(progress)
  }, [progress])

  return (
    <View className="w-full h-3 bg-zinc-700 rounded-xl mt-4">
      <Animated.View
        className="h-3 bg-violet-600/80 rounded-lg"
        style={animtedProgress}
      />
    </View>
  )
}
