import * as RadixCheckBox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import { useState } from 'react'

interface CheckBoxProps extends RadixCheckBox.CheckboxProps {
  title: string
  completed?: boolean
  disabled?: boolean
}

export function CheckBox({ title, completed = false, disabled = false, ...rest }: CheckBoxProps) {
  const [isChecked, setIsChecked] = useState(completed)

  function toggleChecked() {
    console.log('toggleChecked')
    setIsChecked(prevIsChecked => !prevIsChecked)
  }

  return (
    <RadixCheckBox.Root 
      {...rest}
      className="flex flex-row items-center gap-3 group" 
      checked={isChecked}
      onCheckedChange={() => {
        toggleChecked()
        rest.onCheckedChange?.(isChecked)
      }}
      disabled={disabled}
    >
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center border bg-zinc-800 border-zinc-900 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500"
      >
        <RadixCheckBox.Indicator>
          <Check 
            className="text-white"
            size={24} 
          />
        </RadixCheckBox.Indicator>

      </div>

      <span 
        className="text-xl leading-tight font-semibold group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
      >
        {title}
      </span>
    </RadixCheckBox.Root>
  )
}
