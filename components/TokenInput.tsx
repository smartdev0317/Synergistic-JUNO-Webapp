import { StaticImageData } from 'next/image'
import LpTokenImg from './LpTokenImg'
import TokenImg from './TokenImg'

interface PropsType {
  icon: StaticImageData
  iconAlt: string
  totalBalance: string
  amount: string
  onChange: Function
  className?: string
  disabled?: boolean
}

const TokenInput = ({
  icon,
  iconAlt,
  totalBalance,
  amount,
  onChange,
  className,
  disabled,
}: PropsType) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute top-[11px] left-[15px] flex items-center">
        <TokenImg icon={icon} iconAlt={iconAlt} size="small" />
      </div>
      <input
        className="w-full detail-bg-color-1 input-border outline-0 font-td-3 h-[48px] pl-[57px] pr-[71px]"
        placeholder="0.00"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || false}
      />
      <button
        className="detail-btn-bg-color-2 border-button-small font-td-8 px-[9px] py-[4px] absolute top-[12px] right-[15px]"
        onClick={() => onChange(totalBalance)}
        disabled={disabled || false}
      >
        MAX
      </button>
    </div>
  )
}

export default TokenInput
