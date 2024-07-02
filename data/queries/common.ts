import { useQuery, useQueryClient } from "react-query"

import { APR, LP_POOLS, TOKEN_PRICES, TVL, VAULT_USER_REWARD } from "constants/keyNames"
import { loopLpPools, wyndLpPools } from "constants/lpPools"

export const useFetchUserTokenBalances = () => {
    const queryClient = useQueryClient()
    const {data, error, status} = useQuery<any>({
        queryKey: TOKEN_PRICES,
        queryFn: async () => {
            const response: any = await fetch("https://middlewareapi.loop.markets/v1/juno/tokenInfo")
                .then((response) => response.json())
            return response
        },
        onSuccess: async () => {
            loopLpPools.map((each) => {
                queryClient.invalidateQueries({queryKey: [LP_POOLS, each.base, each.pair, APR]})
                queryClient.invalidateQueries({queryKey: [LP_POOLS, each.base, each.pair, VAULT_USER_REWARD]})
                queryClient.invalidateQueries({queryKey: [LP_POOLS, each.base, each.pair, TVL]})
            })
            wyndLpPools.map((each) => {
                queryClient.invalidateQueries({queryKey: [LP_POOLS, each.base, each.pair, APR]})
                queryClient.invalidateQueries({queryKey: [LP_POOLS, each.base, each.pair, VAULT_USER_REWARD]})
                queryClient.invalidateQueries({queryKey: [LP_POOLS, each.base, each.pair, TVL]})
            })
        },
        refetchInterval: 60000
    })
    return {
        data,
        error,
        status
    }
}