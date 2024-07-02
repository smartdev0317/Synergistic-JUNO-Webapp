import { StaticImageData } from 'next/image'

export type Uint128 = string
export type Decimal = string
export type Addr = string

export interface UserTokenBalance {
  address: Addr
  name: string
  symbol: string
  decimals: number
  balance: Uint128
}

export interface TokenBalanceResponse {
  balance: Uint128
}

export interface UserCoinBalance {
  denom: string
  amount: Uint128
}

export interface TokenPrice {
  token: Addr
  name: string
  symbol: string
  decimals: string
  total_supply: string
  unitPrice: string
  updated_at: string
}

export interface TokenType {
  address: Addr
  name: string
  symbol: string
  decimals: number
}

export interface LpFarmDepositType {
  lp: Addr
  detailTitle: string
  detail: string
  linkText: string
  linkUrl: string
  totalBalance: string | undefined
  description: string
}

export interface LpFarmWithdrawType {
  lp: Addr
  detailTitle: string
  detail: string
  linkText: string
  linkUrl: string
  totalBalance: string | undefined
  unbondDescription: string
  unbondingDescription: string
  withdrawDescription: string
  unbond: boolean
  unbondEndTime: number
}

export interface LoopLpFarmDataType {
  name: string
  pair: Addr
  lpAddr: Addr
  lpDecimals: number
  flpAddr: Addr
  flpDecimals: number
  // auto: boolean,
  base: string
  asset0: TokenWithIconType | NativeTokenWithIconType
  asset1: TokenWithIconType | NativeTokenWithIconType
  rewards: TokenWithIconType[]
}

export interface WyndLpFarmDataType {
  name: string
  pair: Addr
  lpAddr: Addr
  lpDecimals: number
  stakingAddr: Addr
  // auto: boolean,
  base: string
  asset0: TokenWithIconType | NativeTokenWithIconType
  asset1: TokenWithIconType | NativeTokenWithIconType
  rewards: TokenWithIconType[]
}

export interface AutoCompoundFarmConvertType {
  note: string
  detailTitle: string
  detail: string
  linkText: string
  linkUrl: string
  baseToken: Addr
  description: string
}

export interface AutoCompoundFarmStakeType {
  note: string
  detailTitle: string
  detail: string
  linkText: string
  linkUrl: string
  baseToken: Addr
  description: string
}

export interface AutoCompoundFarmClaimType {
  note: string
  detailTitle: string
  description: string
}

export interface AutoCompoundFarmUnstakeType {
  note: string
  detailTitle: string
  detail: string
  baseToken: Addr
  description: string
}
export interface TokenIcon {
  symbol: string
  icon: StaticImageData
}

export interface AutoCompoundFarmDataType {
  icon: StaticImageData
  iconAlt: string
  name: string
  // auto: boolean,
  base: Addr
  // apr: string | undefined,
  // userDeposit: string | undefined,
  // tvl: string | undefined,
  // tvlInUsd: string | undefined,
  // estWeeklyYield: string | undefined,
  // reward: string | undefined,
  convert: AutoCompoundFarmConvertType
  stake: AutoCompoundFarmStakeType
  claim: AutoCompoundFarmClaimType
  unstake: AutoCompoundFarmUnstakeType
  token: TokenType
  btoken: TokenType
  vault: Addr
  bvault: Addr
  converterAndStaker: Addr
}

export interface BondingInfoResponse {
  bonding: BondingInfo[]
}

export interface BondingInfo {
  unbonding_period: number
  vote_multiplier: Decimal
  reward_multiplier: Decimal
  total_staked: Uint128
}

export interface AllStakedResponse {
  stakes: StakePeriod[]
}

export interface LoopStakingConfigResponse {
  token_addr: Addr
  owner_addr: Addr
  second_owner_addr: Addr
  vault_address: Addr
  community_addr: Addr
  last_distributed: number
  last_loop_power_date: number
  latest_loop_power_date: number
  wait_time_for_distribution_in_seconds: number
  lock_time_frame: number
  freeze: boolean
  freeze_lock_time: number
  freeze_start_time: number
  loop_power_constant: string
  day_factor_in_seconds: number
  duration_values_vector: number[]
  restake_reset_flag: boolean
}

export interface LoopStakingTotalBalanceResponse {
  balance: string
}

export interface StakePeriod {
  stake: Uint128
  total_locked: Uint128
  unbonding_period: number
  cw20_contract: Addr
}

export interface ConvertToken {
  converter: Addr
  amount: string
  token: Addr
}

export interface StakeToken {
  vault: Addr
  token: Addr
  amount: string
}

export interface WithdrawToken {
  vault: Addr
  amount: string
}

export interface ClaimRewardToken {
  vault: Addr
  token: Addr
}

export interface TokenWithIconType {
  icon: StaticImageData
  symbol: string
  addr: Addr
  decimals: number
}

export interface NativeTokenWithIconType {
  icon: StaticImageData
  symbol: string
  denom: string
  decimals: number
}

export interface TokenBalanceWithPrice {
  balance: string
  price: string
}

// Pool Info Response
export interface PoolInfo {
  assets: AssetInfo[]
  total_share: string
}

export interface AssetInfo {
  info: TokenInfo | NativeTokenInfo
  amount: string
}

export interface TokenInfo {
  token: TokenContract
}

export interface TokenContract {
  contract_addr: Addr
}

export interface NativeTokenInfo {
  native_token: NativeTokenDenom
}

export interface NativeTokenDenom {
  denom: string
}

// list of distributable tokens by pool response
export interface DistributableToken {
  info: string
  daily_reward: string
}

export interface UserRewardInfo {
  pool: Addr
  rewards_info: [Addr, Addr][]
}

export interface UserReward {
  token: Addr
  name: string
  symbol: string
  decimals: string
  price: string
  rewardPerSecond: string
  reward: string
}

export interface SyneBalanceData {
  balance: string
  locked: string
  decimals: number
}

export interface SyneStakingReward {
  reward: string
  duration: number
}

export interface SyneStakingRewardData {
  rewards: SyneStakingReward[]
  decimals: number
}

export interface LoopProposal {
  id: number
  proposal: Proposal
}

export interface Proposal {
  title: string
  description: string
  proposer: string
  expiration: TimeExpiration | HeightExpiration
  voting_period: TimeDuration | HeightDuration
  pending_period: TimeDuration | HeightDuration
  status: string
  allow_revoting: boolean
  total_power: string
  voting_start_time: number
  choices: LoopGaugeChoice[]
  amount: string
  loop_gauge: Addr
  loop_gauge_prooposal_id: number
}

export interface DetailedLoopProposal {
  title: string
  description: string
  proposer: string
  // expiration: TimeExpiration | HeightExpiration
  // voting_period: TimeDuration | HeightDuration
  // pending_period: TimeDuration | HeightDuration
  expiration: TimeExpiration
  voting_period: TimeDuration
  pending_period: TimeDuration
  status: string
  allow_revoting: boolean
  total_power: string
  voting_start_time: number
  choices: DetailedLoopGaugeChoice[]
  amount: string
  loop_gauge: Addr
  loop_gauge_prooposal_id: number
}

export interface TimeExpiration {
  at_time: string
}

export interface HeightExpiration {
  at_height: number
}

export interface TimeDuration {
  time: string
}

export interface HeightDuration {
  height: number
}

export interface LoopGaugeChoice {
  pool: Addr
  votes: VotingPower
}

export interface DetailedLoopGaugeChoice {
  pool: Addr
  votes: VotingPower
  tokens: SymbolWithIcon[]
}

export interface SymbolWithIcon {
  symbol: string
  icon: StaticImageData
}

export interface VotingPower {
  power: string
}

export interface LoopMultipleChoiceVote {
  pool: Addr
  percentage: number
}

export interface WyndMultipleChoiceVote {
  option: string
  weight: Decimal
}

export interface WyndGauge {
  id: number
  wynd_gauge_id: number
  title: string
  adapter: string
  epoch_size: number
  epoch_pending_size: number
  min_percent_selected: Decimal
  max_options_selected: number
  max_available_percentage?: Decimal
  is_stopped: boolean
  next_epoch: number
  reset?: Reset
}

export interface Reset {
  last: number
  reset_each: number
  next: number
}

export interface WyndListOptions {
  options: string[][]
}

export interface DetailedListOption {
  pool: Addr
  power: Uint128
  tokens: SymbolWithIcon[]
}

export interface WyndGaugeDetail {
  wyndGauge: WyndGauge
  totalPower: Uint128
  listOptions: DetailedListOption[]
}

export interface WyndGaugeVersion {
  gauge: number,
  version: string
}

export interface WyndUserStakedByDurationResponse {
  pair_address: Addr,
  unbonding_period: number,
  staked: Uint128,
}

export interface WyndTotalStakedByPairResponse {
  staked: Uint128,
  unbonding: Uint128
}

export interface Token {
  token: Addr
}

export interface Native {
  native: string
}

export type AssetInfoValidated = Token | Native

export interface WyndUserRewardInfoResponse {
  asset_info: AssetInfoValidated,
  /// Pending rewards to user
  pending_rewards: Uint128,
  /// Rewards claimed to user
  claimed_rewards: Uint128,
  /// Reward power
  power: Decimal,
  /// Action time
  action_time: number,
}

export interface WyndPoolInfo {
  assets: WyndAssetInfo[]
  total_share: string
}

export interface WyndAssetInfo {
  info: AssetInfoValidated
  amount: string
}

export interface ClaimsResponse {
  claims: Claim[]
}

export interface Claim {
  amount: Uint128,
  release_at: Expiration
}

export type Expiration = TimeExpiration // | HeightExpiration
