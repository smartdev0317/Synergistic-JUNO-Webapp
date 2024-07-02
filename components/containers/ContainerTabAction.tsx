import { ReactNode } from 'react'

export default function ContainerTabAction({
  children,
}: {
  children: ReactNode
}) {
  return <div className="col-span-6">{children}</div>
}
