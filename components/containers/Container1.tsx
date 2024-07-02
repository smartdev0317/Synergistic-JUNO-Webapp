import { ReactNode } from 'react'

export default function Container1({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#131722] opacity-50 rounded-[15px] px-[24px] py-[20px]">
      {children}
    </div>
  )
}
