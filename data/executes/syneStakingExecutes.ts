import { useWallet } from '@noahsaso/cosmodal'
import { SYNE_STAKING_CONTRACT } from 'constants/address'
import { SYNE, SYNE_STAKING, SYNE_STAKING_REWARD, TOKEN_BALANCE, TOTAL_BALANCE, VESYNE } from 'constants/keyNames'
import { defaultTokenLists } from 'constants/tokenLists'
import { useMutation, useQueryClient } from 'react-query'

export const useStakeSyne = () => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      amount,
      duration,
    }: {
      amount: string
      duration: number
    }) => {
      let syne = defaultTokenLists.find((each) => each.symbol === SYNE)
      if (syne === undefined) {
        throw new Error('Undefined SYNE Token')
      }
      let msg = {
        send: {
          contract: SYNE_STAKING_CONTRACT,
          amount: amount,
          msg: btoa(`{"stake":{"duration":${duration}}}`),
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          syne.address,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, SYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, VESYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOTAL_BALANCE, VESYNE] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING_REWARD, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING, walletAddress] })
    },
  })
  return mutation
}

export const useRestakeSyne = () => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      duration,
    }: {
      duration: number
    }) => {
      let syne = defaultTokenLists.find((each) => each.symbol === SYNE)
      if (syne === undefined) {
        throw new Error('Undefined SYNE Token')
      }
      let msg = {
        "restake":{
          "duration": duration,
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          SYNE_STAKING_CONTRACT,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, SYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, VESYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOTAL_BALANCE, VESYNE] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING_REWARD, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING, walletAddress] })
    },
  })
  return mutation
}

export const useClaimSyne = () => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      duration,
    }: {
      duration: number
    }) => {
      let syne = defaultTokenLists.find((each) => each.symbol === SYNE)
      if (syne === undefined) {
        throw new Error('Undefined SYNE Token')
      }
      let msg = {
        "claim":{
          "duration": duration,
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          SYNE_STAKING_CONTRACT,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, SYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, VESYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOTAL_BALANCE, VESYNE] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING_REWARD, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING, walletAddress] })
    },
  })
  return mutation
}

export const useRestakeAllSyne = () => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      durations,
    }: {
      durations: number[]
    }) => {
      let syne = defaultTokenLists.find((each) => each.symbol === SYNE)
      if (syne === undefined) {
        throw new Error('Undefined SYNE Token')
      }
      let msgs = durations.map((duration) => {
        return {
          contractAddress: SYNE_STAKING_CONTRACT,
          funds: [],
          msg: {
            "restake":{
              "duration": duration,
            },
          }
        }
      })
      if (walletAddress) {
        return await signingCosmWasmClient?.executeMultiple(
          walletAddress,
          msgs,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, SYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, VESYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOTAL_BALANCE, VESYNE] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING_REWARD, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING, walletAddress] })
    },
  })
  return mutation
}

export const useClaimAllSyne = () => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      durations,
    }: {
      durations: number[]
    }) => {
      let syne = defaultTokenLists.find((each) => each.symbol === SYNE)
      if (syne === undefined) {
        throw new Error('Undefined SYNE Token')
      }
      let msgs = durations.map((duration) => {
        return {
          contractAddress: SYNE_STAKING_CONTRACT,
          funds: [],
          msg: {
            "claim":{
              "duration": duration,
            },
          }
        }
      })
      if (walletAddress) {
        return await signingCosmWasmClient?.executeMultiple(
          walletAddress,
          msgs,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, SYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOKEN_BALANCE, VESYNE, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [TOTAL_BALANCE, VESYNE] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING_REWARD, walletAddress] })
      queryClient.invalidateQueries({ queryKey: [SYNE_STAKING, walletAddress] })
    },
  })
  return mutation
}
