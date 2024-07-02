import type { NextPage } from 'next'
import { useEffect } from 'react'

import MyStakedSyne from 'components/Stake/MyStakedSyne'
import PriceChartContainer from 'components/Stake/PriceChartContainer'
import SyneStatistic from 'components/Stake/SyneStatistic'
import SyneStake from 'components/Stake/SyneStake'
import { useFetchSyneData } from 'data/queries/syneQueries'

const Stake: NextPage = () => {
  useFetchSyneData()
  return (
    <>
      <SyneStatistic />
      <div className="grid grid-cols-12 gap-7 mt-[23px]">
        <div className="col-span-12 lg:col-span-7">
          <PriceChartContainer />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <SyneStake />
        </div>
      </div>
      <div className="">
        <MyStakedSyne />
      </div>
    </>
  )
}

export default Stake
