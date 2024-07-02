import { ReactNode } from 'react'

export default function ContainerTab({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-12 my-[17px] text-start gap-6">
      {children}
    </div>
  )
}
