import React from 'react'

interface WeekDayProps {
  children: React.ReactNode
}

export function WeekDay(props: WeekDayProps) {
  return (
    <div className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
      {props.children}
    </div>
  )
}
