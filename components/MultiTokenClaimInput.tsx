import TokenImg from './TokenImg'
import { TokenWithIconType } from 'data/types'

interface PropsType {
  rewards: TokenWithIconType[]
  className?: string
}

const MultiTokenClaimInput = ({ rewards, className }: PropsType) => {
  const renderTokens = () => {
    return (
      <div className="absolute top-[11px] left-[15px] flex items-center">
        {rewards.map((reward, index) => (
          <TokenImg
            key={`multi_token_claim_input-${index}`}
            icon={reward.icon}
            iconAlt={reward.symbol}
            size="small"
            zIndex={10 * (rewards.length - index)}
          />
        ))}
      </div>
    )
  }
  const paddingLeft = `${57 + 18 * (rewards.length - 1)}px`
  return (
    <div className={`relative w-full ${className}`}>
      {renderTokens()}
      <input
        className={`w-full detail-bg-color-1 input-border outline-0 font-td-3 h-[48px] pr-[71px]`}
        placeholder="0.00"
        value="100%"
        disabled
        style={{ paddingLeft }}
      />
      <button
        className="detail-btn-bg-color-2 border-button-small font-td-8 px-[9px] py-[4px] absolute top-[12px] right-[15px]"
        disabled
      >
        max
      </button>
    </div>
  )
}

export default MultiTokenClaimInput
