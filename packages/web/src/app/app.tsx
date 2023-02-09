// eslint-disable-next-line @typescript-eslint/no-unused-vars
import '../lib/dayjs'
import '../styles/global.css'

import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'

export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center text-white">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />

        <SummaryTable />
      </div>
    </div>
  );
}
