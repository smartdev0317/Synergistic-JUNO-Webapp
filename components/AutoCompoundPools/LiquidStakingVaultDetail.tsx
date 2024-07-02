import { useState } from "react";
import { useQueryClient } from 'react-query';
import { useWallet } from "@noahsaso/cosmodal";

import { AutoCompoundFarmDataType, TokenPrice } from "data/types";
import MoneyIcon from '../images/MoneyIcon';
import InfoIcon from "../images/InfoIcon"
import ConvertIcon from "../images/ConvertIcon";
import TokenImg from "../TokenImg";
import { LiquidStakingVaultConvertTab } from "./Tab/LiquidStakingVaultConvertTab";
import { LiquidStakingVaultStakeTab } from "./Tab/LiquidStakingVaultStakeTab";
import { LiquidStakingVaultUnstakeTab } from "./Tab/LiquidStakingVaultUnstakeTab";
import { getFormattedNumber, getReadableBalance } from "data/utils";
import bigDecimal from "js-big-decimal";
import { LiquidStakingvaultClaimTab } from "./Tab/LiquidStakingVaultClaimTab";
import { Reward } from "components/Reward";
import { LiquidStakingVaultInfoTab } from "./Tab/LiquidStakingVaultInfoTab";
import MoneySendIcon from "components/images/MoneySendIcon";
import { APR, AUTO_COMPOUND_POOLS, LOOP, TOKEN_PRICES, VAULT_TOTAL_STAKE, VAULT_USER_DEPOSIT, VAULT_USER_REWARD, WYND } from "constants/keyNames";

interface PropsType {
    index: number
    opened: boolean
    onToggle: Function
    data: AutoCompoundFarmDataType
}

const LiquidStakingVaultDetail = ({ index, opened, onToggle, data }: PropsType) => {
    const [selectedTab, selectTab] = useState(0)
    const queryClient = useQueryClient()
    const { address: walletAddress } = useWallet()
    const {icon, iconAlt, name, /* auto,  **/base, btoken, token, vault, bvault} = data
    const apr: any = queryClient.getQueryData([AUTO_COMPOUND_POOLS, index, APR])
    const vaultTotalStaked: any = queryClient.getQueryData([AUTO_COMPOUND_POOLS, index, VAULT_TOTAL_STAKE])
    const userDeposit: any = queryClient.getQueryData([AUTO_COMPOUND_POOLS, index, walletAddress, VAULT_USER_DEPOSIT])
    const estWeeklyYield = new bigDecimal(apr).multiply(new bigDecimal(userDeposit)).divide(new bigDecimal(100 * 365 / 7), userDeposit?.length || 2).getValue()
    const rewardData: any = queryClient.getQueryData([AUTO_COMPOUND_POOLS, index, walletAddress, VAULT_USER_REWARD])
    const token_prices: TokenPrice[] | undefined = queryClient.getQueryData(TOKEN_PRICES)
    
    let tokenPrice;
    if (token.symbol === LOOP) {
        tokenPrice = Number(token_prices && token_prices.find(each => each.symbol === LOOP)?.unitPrice)
    } else if (token.symbol === WYND) {
        tokenPrice = Number(token_prices && token_prices.find(each => each.symbol === WYND)?.unitPrice)
    }

    const tvlInUsd = (tokenPrice || 0) * (vaultTotalStaked || 0)

    const renderDetail = () => {
        switch (selectedTab) {
            case 0: return (
                <LiquidStakingVaultConvertTab
                    icon={icon}
                    iconAlt={iconAlt}
                    index={index}
                />
            )
            case 1: return (
                <LiquidStakingVaultStakeTab
                    icon={icon}
                    iconAlt={iconAlt}
                    index={index}
                    onChange={() => selectTab(0)}
                />
            )
            case 2: return (
                <LiquidStakingvaultClaimTab
                    icon={icon}
                    iconAlt={iconAlt}
                    index={index}
                />
            )
            case 3: return (
                <LiquidStakingVaultUnstakeTab
                    icon={icon}
                    iconAlt={iconAlt}
                    index={index}
                />
            )
            case 4: return (
                <LiquidStakingVaultInfoTab
                    index={index}
                    btoken={btoken.address}
                    vault={vault}
                    bvault={bvault}
                />
            )
        }
    }
    return (
        <div className={`${opened ? "w-[768px] md:w-full second-bg-detail-color border-liquidity-detail mb-[8px]" : "w-[768px] md:w-full secondary-bg-color border-liquidity mb-[8px]"}`}>
            <button
                className={`w-full grid grid-cols-12 gap-4 md:gap-8 px-[16px] py-[15px]`}
                onClick={() => onToggle()}
            >
                <div className="col-span-3 flex h-full items-center gap-3">
                    <TokenImg icon={icon} iconAlt={iconAlt} size="big" />
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <p className="font-td-1">{name}</p>
                            {/* {
                                auto ? 
                                    <p className="font-td-badge badge-bg-color badge-color-1 border-button-small px-[5px] ml-1">auto</p> : 
                                    <p className="font-td-badge badge-bg-color badge-color-2 border-button-small px-[5px] ml-1">manual</p>
                            } */}
                        </div>
                        <p className="font-td-2 tertiary-color">{base}</p>
                    </div>
                </div>
                <div className="col-span-1 flex h-full items-center justify-start">
                    <p className={`${Number(apr) > 0 ? "apr-color-1" : "apr-color-2"} font-td-3`}>{getFormattedNumber(apr) || 0}%</p>
                </div>
                <div className="col-span-2 flex h-full items-center justify-start">
                    <p className="primary-color font-td-3">{getReadableBalance(userDeposit, btoken.decimals) || 0}</p>
                </div>
                <div className="col-span-2 flex h-full items-start flex-col justify-center">
                    <p className="primary-color font-td-3">{getReadableBalance(vaultTotalStaked, btoken.decimals) || 0}</p>
                    <p className="tertiary-color font-td-4">${getFormattedNumber(getReadableBalance(tvlInUsd.toString(), btoken.decimals)) || 0} total</p>
                </div>
                <div className="col-span-2 flex h-full items-center">
                    <p className="primary-color font-td-3">{getReadableBalance(estWeeklyYield, btoken.decimals) || 0}</p>
                </div>
                <div className="col-span-2 flex justify-end h-full items-center">
                    <Reward className="primary-color font-td-3" rewardData={rewardData} decimals={btoken.decimals} totalStaked={vaultTotalStaked} userStaked={userDeposit} />
                </div>
            </button>
            <div
                className={`${!opened && "hidden"} w-[768px] md:w-full px-[16px] pb-[14px] border-liquidity-detailed `}
            >
                <div className="grid grid-cols-10 md:grid-cols-10 mb-[8px] detail-bg-color-1 border-liquidity">
                    <button className={`${selectedTab === 0 && "detail-btn-bg-color-1"} flex items-center col-span-2 justify-center py-[13px] m-1 border-button`} onClick={() => selectTab(0)}>
                        <ConvertIcon active={selectedTab === 0} />
                        <p className={`${selectedTab === 0 ? "fourth-color" : "secondary-color font-[600]"} font-tab ml-2`}>Convert</p>
                        {/* <ConvertIcon active={true} />
                        <p className="fourth-color font-tab ml-2">Convert</p> */}
                    </button>
                    <button className={`${selectedTab === 1 && "detail-btn-bg-color-1"} flex items-center col-span-2 justify-center py-[13px] m-1 border-button`} onClick={() => selectTab(1)}>
                        <MoneyIcon active={selectedTab === 1} />
                        <p className={`${selectedTab === 1 ? "fourth-color" : "secondary-color font-[600]"} font-tab ml-2`}>Stake</p>
                        {/* <MoneyIcon active={false} />
                        <p className="secondary-color font-[600] font-tab ml-2">Stake</p> */}
                    </button>
                    <button className={`${selectedTab === 2 && "detail-btn-bg-color-1"} flex items-center col-span-2 justify-center py-[13px] m-1 border-button`} onClick={() => selectTab(2)}>
                        <MoneyIcon active={selectedTab === 2} />
                        <p className={`${selectedTab === 2 ? "fourth-color" : "secondary-color font-[600]"} font-tab ml-2`}>Claim</p>
                        {/* <MoneyIcon active={false} />
                        <p className="secondary-color font-[600] font-tab ml-2">Claim</p> */}
                    </button>
                    <button className={`${selectedTab === 3 && "detail-btn-bg-color-1"} flex items-center col-span-2 justify-center py-[13px] m-1 border-button`} onClick={() => selectTab(3)}>
                        <MoneySendIcon active={selectedTab === 3} />
                        <p className={`${selectedTab === 3 ? "fourth-color" : "secondary-color font-[600]"} font-tab ml-2`}>Unstake</p>
                        {/* <MoneySendIcon active={false} />
                        <p className="secondary-color font-[600] font-tab ml-2">Unstake</p> */}
                    </button>
                    <button className={`${selectedTab === 4 && "detail-btn-bg-color-1"} flex items-center col-span-2 justify-center py-[13px] m-1 border-button`} onClick={() => selectTab(4)}>
                        <InfoIcon active={selectedTab === 4} width="20px" />
                        <p className={`${selectedTab === 4 ? "fourth-color" : "secondary-color font-[600]"} font-tab ml-2`}>Pool Info</p>
                        {/* <InfoIcon active={false} width="20px" />
                        <p className="secondary-color font-[600] font-tab ml-2">Pool Info</p> */}
                    </button>
                </div>
                {renderDetail()}
            </div>
        </div>
    )
}
export default LiquidStakingVaultDetail