import bigDecimal from 'js-big-decimal'

import { Uint128 } from './types'

export const getReadableBalance = (
  balance: Uint128,
  decimals: number,
  fixed: number = -1
): string => {
  if (balance) {
    let result = new bigDecimal(balance)
    let division = new bigDecimal(Math.pow(10, decimals))
    if (fixed !== -1) {
      result = result.divide(division, fixed)
    } else if (Number(balance) / Math.pow(10, decimals) < 0.001)
      result = result.divide(division, decimals)
    else if (Number(balance) / Math.pow(10, decimals) < 0.1) {
      result = result.divide(division, 4)
    } else {
      result = result.divide(division, 2)
    }

    return result.getPrettyValue(3, ',')
  }
  return ''
}

export const getReducedBalance = (
  balance: Uint128,
  decimals: number,
  fixed: number = -1
): string => {
  if (balance) {
    let result = new bigDecimal(balance)
    let division = new bigDecimal(Math.pow(10, decimals))
    let suffix = ''
    if (fixed !== -1) {
      result = result.divide(division, fixed)
      if (Number(result.getValue()) >= Math.pow(10, 6)) {
        result = result.divide(
          new bigDecimal(Math.pow(10, 6)),
          fixed
        )
        suffix = 'm'
      } else if (Number(result.getValue()) >= Math.pow(10, 3)) {
        result = result.divide(
          new bigDecimal(Math.pow(10, 3)),
          fixed
        )
        suffix = 'k'
      }
    } else if (Number(balance) / Math.pow(10, decimals) < 0.001)
      result = result.divide(division, decimals)
    else if (Number(balance) / Math.pow(10, decimals) < 0.1) {
      result = result.divide(division, 4)
    } else {
      result = result.divide(division, 2)
      if (Number(result.getValue()) >= Math.pow(10, 6)) {
        result = result.divide(new bigDecimal(Math.pow(10, 6)), 2)
        suffix = 'm'
      } else if (Number(result.getValue()) >= Math.pow(10, 3)) {
        result = result.divide(new bigDecimal(Math.pow(10, 3)), 2)
        suffix = 'k'
      }
    }
    return result.getPrettyValue(3, ',').concat(suffix)
  }
  return ''
}

export const getReadableValue = (value: string): string => {
  if (Number(value) === 0) return '0.00'
  if (Number(value) > 0.1) return Number(value).toFixed(2)
  if (Number(value) > 0.001) return Number(value).toFixed(4)
  return Number(value).toFixed(6)
}

export const getFormattedNumber = (
  data: Uint128,
  fixed: number = 2
): string => {
  if (data) {
    let result = new bigDecimal(data)
    result = result.divide(new bigDecimal(1), fixed)
    return result.getPrettyValue(3, ',')
  }
  return ''
}

export const reducedWalletAddress = (address: string, length?: number) => {
  if (address && length)
    return `${address.slice(0, 5 + length)}...${address.slice(
      address.length - length
    )}`
  else if (address && !length)
    return `${address.slice(0, 8)}...${address.slice(address.length - 4)}`
  else return ''
}
