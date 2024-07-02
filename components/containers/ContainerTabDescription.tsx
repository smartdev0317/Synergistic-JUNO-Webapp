import { ReactNode } from 'react'

export default function ContainerTabDescription({
  note,
  children,
}: {
  note: string
  children: ReactNode
}) {
  return (
    <div className="col-span-6">
      <p className="font-td-1-1 primary-color mb-[17px]">{note}</p>
      <div className="detail-bg-color-3 border-small p-[16px] h-[129px] relative">
        {children}
      </div>
    </div>
  )
}
