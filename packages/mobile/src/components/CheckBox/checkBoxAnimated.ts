import { useEffect } from 'react'
import { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated'

type DictColor = {
  [k: number]: string
}
interface CheckBoxAnimatedProps {
  checked: boolean
  colors: {
    green: DictColor
    zinc: DictColor,
  }
}
export function checkBoxAnimated({
  checked,
  colors
}: CheckBoxAnimatedProps) {
  const bgColor = checked ? colors.green[500] : colors.zinc[900]

  const shared = {
    bgColor: useSharedValue(bgColor)
  }

  useEffect(() => {
    shared.bgColor.value = withDelay(
      200, 
      withTiming(bgColor))
  }, [checked])

  const styleAnimated = {
    bgColor: useAnimatedStyle(() => {
      return {
        backgroundColor: shared.bgColor.value,
      }
    })
  }

  return { 
    styleAnimated 
  }
}



