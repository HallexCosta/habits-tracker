export interface SummaryItem {
  id: string
  date: Date
  completed: number
  amount: number
}

export type Summary = Array<SummaryItem>
