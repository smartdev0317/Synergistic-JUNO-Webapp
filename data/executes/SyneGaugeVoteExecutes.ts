import { useWallet } from '@noahsaso/cosmodal'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { SYNERGISTIC_LOOP_GAUGE_CONTRACT, SYNERGISTIC_WYND_GAUGE_CONTRACT } from 'constants/address'
import { loopGaugeVoteNow, loopGaugeVotes, wyndGaugeVoteNow, wyndGaugeVotes } from 'data/atom'
import {
  ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID,
  loopGaugeLpList,
} from 'constants/loopGauge'
import { LOOP_GAUGE, WYND_GAUGE } from 'constants/keyNames'
import { ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID, wyndGaugeLpList } from 'constants/wyndGauge'

export const useLoopVoteSyneGuage = () => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()
  const votes = useRecoilValue(loopGaugeVotes)
  const setVoteNow = useSetRecoilState(loopGaugeVoteNow)
  const setVotes = useSetRecoilState(loopGaugeVotes)

  const mutation = useMutation({
    mutationFn: async () => {
      let total_percentage = votes.reduce(
        (accumulator, currentValue) => accumulator + currentValue.percentage,
        0
      )
      if (total_percentage < 100) {
        throw new Error('Total Vote must be 100%')
      }
      let msg = {
        vote: {
          proposal_id: ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID,
          vote: votes,
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          SYNERGISTIC_LOOP_GAUGE_CONTRACT,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: [LOOP_GAUGE] })
      setVoteNow(0)
      setVotes(
        loopGaugeLpList.map((each: any) => {
          return {
            pool: each.address,
            percentage: 0,
          }
        })
      )
    },
  })
  return mutation
}

export const useWyndVoteSyneGuage = () => {
  const { address: walletAddress, signingCosmWasmClient } = useWallet()
  const queryClient = useQueryClient()
  const votes = useRecoilValue(wyndGaugeVotes)
  const setVoteNow = useSetRecoilState(wyndGaugeVoteNow)
  const setVotes = useSetRecoilState(wyndGaugeVotes)

  const mutation = useMutation({
    mutationFn: async () => {
      // let total_percentage = votes.reduce(
      //   (accumulator, currentValue) => accumulator + Number(currentValue.weight),
      //   0
      // )
      let msg = {
        place_votes: {
          gauge: ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID,
          votes: votes.filter(each => each.weight !== "0"),
        },
      }
      if (walletAddress) {
        return await signingCosmWasmClient?.execute(
          walletAddress,
          SYNERGISTIC_WYND_GAUGE_CONTRACT,
          msg,
          'auto'
        )
      } else {
        throw new Error('Please connect wallet')
      }
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: [WYND_GAUGE] })
      setVoteNow(0)
      setVotes(
        wyndGaugeLpList.map((each: any) => {
          return {
            option: each.address,
            weight: "0",
          }
        })
      )
    },
  })
  return mutation
}
