import { useState } from 'react'
import type { NextPage } from 'next'

import VeSyneStaticstic from 'components/Vote/VeSyneStatistic'
import Voting from 'components/Vote'
import { useFetchGaugeData } from 'data/queries/syneQueries'
import {
  useSynergisticLoopGaugeProposal,
  useSynergisticLoopGaugeProposalVersion,
  useSynergisticWyndGaugeProposal,
  useSynergisticWyndGaugeProposalVersion,
} from 'data/queries/synergisticGaugeQueries'

const Vote: NextPage = () => {
  useFetchGaugeData()
  useSynergisticLoopGaugeProposal()
  useSynergisticLoopGaugeProposalVersion()
  useSynergisticWyndGaugeProposal()
  useSynergisticWyndGaugeProposalVersion()

  const [selectedTab, selectTab] = useState(2)

  return (
    <>
      <VeSyneStaticstic selectedTab={selectedTab} />
      <Voting selectTab={selectTab} selectedTab={selectedTab} />
    </>
  )
}

export default Vote
