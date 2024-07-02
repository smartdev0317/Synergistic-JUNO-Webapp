import { StaticImageData } from 'next/image'
import LpTokenImg from './LpTokenImg'

interface PropsType {
  icon1: StaticImageData
  icon2: StaticImageData
  icon1Alt: string
  icon2Alt: string
  totalBalance: string
  amount: string
  onChange: Function
  className?: string
  disabled?: boolean
}

const LpTokenInput = ({
  icon1,
  icon2,
  icon1Alt,
  icon2Alt,
  totalBalance,
  amount,
  onChange,
  className,
  disabled,
}: PropsType) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute top-[12px] left-[16px]">
        <LpTokenImg
          icon1={icon1}
          icon2={icon2}
          icon1Alt={icon1Alt}
          icon2Alt={icon2Alt}
        />
      </div>
      <input
        className="w-full detail-bg-color-1 input-border outline-0 font-td-3 h-[48px] pl-[63px] pr-[71px]"
        placeholder="0.00"
        value={amount}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        className="detail-btn-bg-color-2 border-button-small font-td-8 px-[9px] py-[4px] absolute top-[12px] right-[15px]"
        onClick={() => onChange(totalBalance)}
      >
        MAX
      </button>
    </div>
  )
}

export default LpTokenInput
