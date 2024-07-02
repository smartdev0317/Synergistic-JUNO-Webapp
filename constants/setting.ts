import { FIVE_MONTHS, ONE_MONTH, ONE_YEAR, SIX_MONTHS, THREE_MONTHS, TWO_YEARS } from "./keyNames";

export const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME
export const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'ujuno'

export const DEFAULT_REFETCH_ON_WINDOW_FOCUS_STALE_TIME = 60000 // ms
export const ICON_ACTIVE_COLOR = "#8B91F9";
export const ICON_DEFAULT_COLOR = "#9496B7";

export const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || "https://rpc-juno.mib.tech"

export const STAKING_PERIODS = {
    [ONE_MONTH]: 1,
    [THREE_MONTHS]: 3,
    [SIX_MONTHS]: 6,
    [ONE_YEAR]: 12,
    [TWO_YEARS]: 24,
}

export const LOOP_STAKING_PERIODS = {
    [ONE_MONTH]: 1,
    [THREE_MONTHS]: 3,
    [FIVE_MONTHS]: 5,
    [SIX_MONTHS]: 6,
    [ONE_YEAR]: 12,
}
