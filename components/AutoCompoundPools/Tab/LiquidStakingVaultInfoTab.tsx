interface PropsType {
  index: number
  btoken: string
  vault: string
  bvault: string
}

export const LiquidStakingVaultInfoTab = ({
  index,
  btoken,
  vault,
  bvault,
}: PropsType) => {
  const renderToken = () => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-between mb-[10px] gap-2">
            <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
              bWYND Token:
            </p>
            <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
              -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <p className="font-td-5 tertiary-color font-normal">{btoken}</p>
          </div>
        )
      case 1:
        return (
          <div className="flex items-center justify-between mb-[10px] gap-2">
            <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
              bLOOP Token:
            </p>
            <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
              -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <p className="font-td-5 tertiary-color font-normal">{btoken}</p>
          </div>
        )
    }
  }
  const renderStakingContract = () => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-between mb-[10px] gap-2">
            <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
              WYND Staking:
            </p>
            <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
              -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <p className="font-td-5 tertiary-color font-normal">{vault}</p>
          </div>
        )
      case 1:
        return (
          <div className="flex items-center justify-between mb-[10px] gap-2">
            <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
              LOOP Staking:
            </p>
            <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
              -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <p className="font-td-5 tertiary-color font-normal">{vault}</p>
          </div>
        )
    }
  }
  const renderBVaultContract = () => {
    switch (index) {
      case 0:
        return (
          <div className="flex items-center justify-between mb-[10px] gap-2">
            <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
              Synergistic bWYND Vault:
            </p>
            <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
              -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <p className="font-td-5 tertiary-color font-normal">{bvault}</p>
          </div>
        )
      case 1:
        return (
          <div className="flex items-center justify-between mb-[10px] gap-2">
            <p className="font-td-5 tertiary-color font-normal whitespace-nowrap">
              Synergistic bLOOP Vault:
            </p>
            <div className="flex grow tertiary-color overflow-hidden whitespace-nowrap">
              -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            </div>
            <p className="font-td-5 tertiary-color font-normal">{bvault}</p>
          </div>
        )
    }
  }
  return (
    <div className="my-[17px] text-start md:h-[158px]">
      <p className="font-td-1 primary-color mb-[17px]">Contracts</p>
      <div className="detail-bg-color-3 border-small p-[16px] h-[129px] relative">
        {renderToken()}
        {renderStakingContract()}
        {renderBVaultContract()}
      </div>
    </div>
  )
}
