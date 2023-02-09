import clsx from 'clsx'
import colors from 'tailwindcss/colors'
import { Feather } from '@expo/vector-icons'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated'

import { checkBoxAnimated } from './checkBoxAnimated'

interface Props extends TouchableOpacityProps {
  title: string
  checked?: boolean
  lineThrough?: boolean
}

export function CheckBox({ title, checked = false, lineThrough = false, ...rest }: Props) {
  const FeatherAnimated = Animated.createAnimatedComponent(Feather)

  const { styleAnimated } = checkBoxAnimated({
    colors,
    checked
  })

  return (
    <TouchableOpacity
      activeOpacity={.7}
      className="flex-row mb-2 items-center"
      {...rest}
    >
      {
        <Animated.View 
          className={`h-8 w-8 rounded-lg items-center justify-center`}
          style={styleAnimated.bgColor}
        >
        {
          checked && (
            <FeatherAnimated
              name='check'
              color={colors.white}
              size={20}
              entering={ZoomIn}
              exiting={ZoomOut}
            />
          )
        }
        </Animated.View>
      }

      <Text className={clsx('text-white text-base ml-3 font-semibold', {
        'line-through': checked && lineThrough
      })}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
