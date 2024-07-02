import { LOOP_PROTOCOL_FARMING_CONTRACT, LOOP_STACKING_ADDR, WYND_STACKING_ADDR } from "constants/address"
import { LOOP, WYND } from "constants/keyNames"

interface PropsType {
  name: string
  pair: string
  lpAddr: string
  base: string
}

export const PoolInfoTab = ({ name, pair, lpAddr, base }: PropsType) => {
  const renderStakingContract = () => {
    switch (base) {
      case LOOP:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            {LOOP_PROTOCOL_FARMING_CONTRACT}
          </p>
        )
      case WYND:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            {LOOP_PROTOCOL_FARMING_CONTRACT}
          </p>
        )
    }
  }
  const renderAutoCompoundContract = () => {
    switch (base) {
      case LOOP:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            {LOOP_STACKING_ADDR}
          </p>
        )
      case WYND:
        return (
          <p className="font-td-5 tertiary-color font-normal">
            {WYND_STACKING_ADDR}
          </p>
        )
    }
  }
  return (
    <div className="my-[17px] text-start md:h-[158px]">
      <p className="font-td-1 primary-color mb-[17px]">Contracts</p>
      <div className="detail-bg-color-3 border-small p-[16px] h-[129px] relative">
        <div className="flex items-center justify-between mb-[10px] gap-2">
          <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">{`${name} Contract:`}</p>
          <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
            -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          </div>
          <p className="font-td-5 tertiary-color font-normal">{lpAddr}</p>
        </div>
        <div className="flex items-center justify-between mb-[10px] gap-2">
          <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
            Staking Contract:
          </p>
          <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
            -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          </div>
          {renderStakingContract()}
        </div>
        <div className="flex items-center justify-between mb-[10px] gap-2">
          <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
            Synergistic Staking Contract:
          </p>
          <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
            -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          </div>
          {renderAutoCompoundContract()}
        </div>
      </div>
    </div>
  )
}
