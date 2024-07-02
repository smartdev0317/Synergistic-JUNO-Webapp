import type { NextPage } from 'next'

import LpPools from 'components/LpPools'
import AutoCompoundPools from 'components/AutoCompoundPools/index'

const Pools: NextPage = () => {
  return (
    <>
      <AutoCompoundPools />
      <div className="pb-[54px]" />
      <LpPools />
      <div className="pb-[54px]" />
    </>
  )
}

export default Pools
