import { useRecoilValue } from 'recoil'
import { useWallet } from '@noahsaso/cosmodal'
import { useQueryClient } from 'react-query'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { loopGaugeVoteNow } from 'data/atom'
import LoopGaugeHistory from '../LoopGaugeHistory'
import LoopGaugeLpList from '../LoopGaugeLPList'
import { TOKEN_BALANCE, VESYNE } from 'constants/keyNames'
import { useLoopVoteSyneGuage } from 'data/executes/SyneGaugeVoteExecutes'
import Link from 'next/link'

const LoopFarmingGauge = () => {
  const queryClient = useQueryClient()
  const voteNow = useRecoilValue(loopGaugeVoteNow)
  const { address: walletAddress } = useWallet()
  const mutation = useLoopVoteSyneGuage()

  const veSyneBalanceData: any = queryClient.getQueryData([
    TOKEN_BALANCE,
    VESYNE,
    walletAddress,
  ])

  const veSyneBalance = veSyneBalanceData?.balance || '0'

  const handleLoopGaugeVote = () => {
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
          onClick={() => handleLoopGaugeVote()}
          className="hidden md:block rounded-[8px] font-16-24-700-hk px-[21px] py-[16px] disabled:opacity-50 detail-btn-bg-color-4"
          disabled={voteNow !== 100 || Number(veSyneBalance) === 0}
        >
          {voteNow === 100 ? 'Vote now' : `Vote now · ${100 - voteNow}% Left`}
        </button>
      </div>
      <div className="flex md:hidden justify-between items-center mt-4">
        <button
          onClick={() => {}}
          className="rounded-[8px] font-16-24-700-hk px-[21px] py-[16px] btn-border detail-btn-bg-color-3 disabled:opacity-50 mr-[5px]"
        >
          Get SYNE to Vote
        </button>
        <button
          onClick={() => handleLoopGaugeVote()}
          className="rounded-[8px] font-16-24-700-hk px-[21px] py-[16px] disabled:opacity-50 detail-btn-bg-color-4"
          disabled={voteNow !== 100 || Number(veSyneBalance) === 0}
        >
          {voteNow === 100 ? 'Vote now' : `Vote now · ${100 - voteNow}% Left`}
        </button>
      </div>
      <LoopGaugeLpList />
      <LoopGaugeHistory />
    </div>
  )
}

export default LoopFarmingGauge
