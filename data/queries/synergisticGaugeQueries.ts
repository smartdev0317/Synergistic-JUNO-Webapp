import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useInfiniteQuery, useQuery } from 'react-query'

import {
  // LOOP_GAUGE_CONTRACT,
  SYNERGISTIC_LOOP_GAUGE_CONTRACT,
  SYNERGISTIC_WYND_GAUGE_CONTRACT,
} from 'constants/address'
import { PUBLIC_RPC_ENDPOINT } from 'constants/setting'
import {
  LoopProposal,
  WyndGauge,
  WyndGaugeDetail,
  WyndGaugeVersion,
  WyndListOptions,
} from 'data/types'
import {
  // ACTIVE_LOOP_GAUGE_PROPOSAL_ID,
  ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID,
  loopGaugeLpList,
} from 'constants/loopGauge'
import {
  LOOP_GAUGE,
  PROPOSAL_HISTORY,
  PROPOSAL_VERSION,
  PROPOSAL_VOTE,
  WYND_GAUGE,
} from 'constants/keyNames'
import bigDecimal from 'js-big-decimal'
import { useWallet } from '@noahsaso/cosmodal'
import { ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID, wyndGaugeLpList } from 'constants/wyndGauge'

export const useSynergisticLoopGaugeProposal = () => {
  const { data, error } = useQuery({
    queryKey: [LOOP_GAUGE],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      // let loopProposal: any = await cosmwasmClient.queryContractSmart(
      //   LOOP_GAUGE_CONTRACT,
      //   { proposal: { proposal_id: ACTIVE_LOOP_GAUGE_PROPOSAL_ID } }
      // )
      let proposal: LoopProposal | undefined =
        await cosmwasmClient.queryContractSmart(
          SYNERGISTIC_LOOP_GAUGE_CONTRACT,
          {
            proposal: {
              proposal_id: ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID,
            },
          }
        )
      // let total_power = new bigDecimal(proposal?.proposal.total_power || '0')
      //   .add(new bigDecimal(loopProposal?.proposal.total_power || '0'))
      let total_power = new bigDecimal(proposal?.proposal.total_power || '0')
        .divide(new bigDecimal('1000000'), 2)
        .getValue()
      if (proposal === undefined) return undefined
      else {
        let proposalDetail = proposal.proposal
        let choices = proposalDetail.choices
        let detailedChoices = choices.map((choice) => {
          let choiceDetail = loopGaugeLpList.find(
            (lp) => lp.address === choice.pool
          )
          // let multiple_choice_option =
          //   loopProposal.proposal.multiple_choice_options.find(
          //     (option: any) => option.pool == choice.pool
          //   )
          let votes = choice.votes
          // votes.power = new bigDecimal(votes.power)
          //   .add(new bigDecimal(multiple_choice_option.votes.power))
          votes.power = new bigDecimal(votes.power)
            .divide(new bigDecimal('1000000'), 2)
            .getValue()
          return {
            pool: choice.pool,
            votes: votes,
            tokens: choiceDetail?.tokens,
          }
        })
        detailedChoices.sort(
          (a, b) => Number(b.votes.power) - Number(a.votes.power)
        )
        proposalDetail.choices = detailedChoices
        proposalDetail.total_power = total_power
        return proposalDetail
      }
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

export const useSynergisticWyndGaugeProposal = () => {
  const { data, error } = useQuery({
    queryKey: [WYND_GAUGE],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let gauge: WyndGauge | undefined =
        await cosmwasmClient.queryContractSmart(
          SYNERGISTIC_WYND_GAUGE_CONTRACT,
          { gauge: { id: ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID } }
        )
      let listOptions: WyndListOptions | undefined =
        await cosmwasmClient.queryContractSmart(
          SYNERGISTIC_WYND_GAUGE_CONTRACT,
          {
            list_options: {
              gauge: ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID,
              start_after: null,
              limit: 100,
            },
          }
        )
      if (!gauge) return undefined
      if (!listOptions) return undefined
      let totalPower = listOptions.options.reduce(
        (a, b) => new bigDecimal(a).add(new bigDecimal(b[1])).getValue(),
        '0'
      )
      let detailedListOptions = listOptions.options.map((each) => {
        let optionDetail = wyndGaugeLpList.find(
          (lp) => lp.address === each[0]
        )
        return {
          pool: each[0],
          power: each[1],
          tokens: optionDetail?.tokens || []
        }
      })
      let gaugeDetail: WyndGaugeDetail = {
        wyndGauge: gauge,
        totalPower,
        listOptions: detailedListOptions,
      }
      return gaugeDetail
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

export const useSynergisticLoopGaugeProposalVersion = () => {
  const { data, error } = useQuery({
    queryKey: [LOOP_GAUGE, PROPOSAL_VERSION],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let loopProposalVersion: any = await cosmwasmClient.queryContractSmart(
        SYNERGISTIC_LOOP_GAUGE_CONTRACT,
        {
          proposal_version: {
            proposal_id: ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID,
          },
        }
      )
      return loopProposalVersion
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

export const useSynergisticWyndGaugeProposalVersion = () => {
  const { data, error } = useQuery({
    queryKey: [WYND_GAUGE, PROPOSAL_VERSION],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let wyndProposalVersion: WyndGaugeVersion | undefined =
        await cosmwasmClient.queryContractSmart(
          SYNERGISTIC_WYND_GAUGE_CONTRACT,
          {
            gauge_version: {
              gauge: ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID,
            },
          }
        )
      return wyndProposalVersion
    },
    refetchInterval: 300000,
  })
  return {
    data,
    error,
  }
}

export const useSynergisticLoopGaugeProposalHistory = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [LOOP_GAUGE, PROPOSAL_HISTORY],
    queryFn: async ({ pageParam = null }) => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let proposalHistory: any = await cosmwasmClient.queryContractSmart(
        SYNERGISTIC_LOOP_GAUGE_CONTRACT,
        {
          proposal_history: {
            proposal_id: ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID,
            start_after: pageParam,
            reverse: true,
          },
        }
      )
      return proposalHistory.history
    },
    getNextPageParam: (lastPage) =>
      lastPage.length > 0 ? lastPage[lastPage.length - 1].version : undefined,
  })
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  }
}

export const useSynergisticWyndGaugeProposalHistory = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [WYND_GAUGE, PROPOSAL_HISTORY],
    queryFn: async ({ pageParam = null }) => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let proposalHistory: any = await cosmwasmClient.queryContractSmart(
        SYNERGISTIC_WYND_GAUGE_CONTRACT,
        {
          vote_history_reverse: {
            gauge: ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID,
            start_after: pageParam,
          },
        }
      )
      return proposalHistory.vote_history
    },
    getNextPageParam: (_lastPage) =>
      // lastPage.length > 0 ? lastPage[lastPage.length - 1].version : undefined,
      undefined
  })
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  }
}

export const useSynergisticLoopGaugeVote = (proposalVersion: string) => {
  const { address: walletAddress } = useWallet()
  const { data, error } = useQuery({
    queryKey: [LOOP_GAUGE, PROPOSAL_VOTE, walletAddress, proposalVersion],
    queryFn: async () => {
      let cosmwasmClient = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
      let loop_gauge_vote: any = await cosmwasmClient.queryContractSmart(
        SYNERGISTIC_LOOP_GAUGE_CONTRACT,
        {
          get_vote: {
            proposal_id: ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID,
            voter: walletAddress,
            version: proposalVersion,
          },
        }
      )
      return loop_gauge_vote
    },
  })
  return {
    data,
    error,
  }
}
