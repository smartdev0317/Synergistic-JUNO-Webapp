import { useEffect } from 'react'
import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { useWallet } from '@noahsaso/cosmodal'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { wyndGaugeVoteNow } from 'data/atom'
import { useWyndVoteSyneGuage } from 'data/executes/SyneGaugeVoteExecutes'
import WyndGaugeHistory from '../WyndGaugeHistory'
import { TOKEN_BALANCE, VESYNE } from 'constants/keyNames'
import WyndGaugeLpList from '../WyndGaugeLPList'


const WyndFarmingGauge = () => {
  const queryClient = useQueryClient()
  const voteNow = useRecoilValue(wyndGaugeVoteNow)
  const { address: walletAddress } = useWallet()
  const mutation = useWyndVoteSyneGuage()

  const veSyneBalanceData: any = queryClient.getQueryData([
    TOKEN_BALANCE,
    VESYNE,
    walletAddress,
  ])

  const veSyneBalance = veSyneBalanceData?.balance || '0'

  const handleWyndGaugeVote = () => {
    mutation.mutate()
  }

  useEffect(() => {
    if (mutation.isLoading) toast.loading('Pending', { autoClose: false })
    if (mutation.isSuccess) {
      toast.dismiss()
      toast(
        <div>
          <a
            href={`https://www.mintscan.io/juno/txs/${mutation.data?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {mutation.data?.transactionHash?.slice(0, 5)}...
            {mutation.data?.transactionHash?.slice(
              mutation.data?.transactionHash?.length - 5
            )}
          </a>
        </div>,
        {
          type: 'success',
        }
      )
    }
  }, [mutation.isLoading, mutation.isSuccess, mutation.data])

  useEffect(() => {
    if (mutation.isError) {
      if (mutation.error instanceof Error) {
        toast.dismiss()
        toast.error(mutation.error.message)
      }
    }
  }, [mutation.isError, mutation.error])

  return (
    <div className="mt-[30px]">
      <div className="flex justify-center md:justify-between items-center">
        <Link href="/stake">
          <div className="hidden md:block rounded-[8px] font-16-24-700-hk px-[21px] py-[16px] btn-border detail-btn-bg-color-3">
            Get SYNE to Vote
          </div>
        </Link>
        <p className="font-24-30-700-hk">
          Vote on the distribution of farming rewards
        </p>
        <button
          onClick={() => handleWyndGaugeVote()}
          className="hidden md:block rounded-[8px] font-16-24-700-hk px-[21px] py-[16px] disabled:opacity-50 detail-btn-bg-color-4"
          disabled={Number(veSyneBalance) === 0}
        >
          {voteNow === 100 ? 'Vote now' : `Vote now · ${100 - voteNow}% Left`}
        </button>
      </div>
      <div className="flex md:hidden justify-between items-center mt-4">
        <Link href="/stake">
          <div className="hidden md:block rounded-[8px] font-16-24-700-hk px-[21px] py-[16px] btn-border detail-btn-bg-color-3">
            Get SYNE to Vote
          </div>
        </Link>
        <button
          onClick={() => handleWyndGaugeVote()}
          className="rounded-[8px] font-16-24-700-hk px-[21px] py-[16px] disabled:opacity-50 detail-btn-bg-color-4"
          disabled={Number(veSyneBalance) === 0}
        >
          {voteNow === 100 ? 'Vote now' : `Vote now · ${100 - voteNow}% Left`}
        </button>
      </div>
      <WyndGaugeLpList />
      <WyndGaugeHistory />
    </div>
  )
}

export default WyndFarmingGauge
