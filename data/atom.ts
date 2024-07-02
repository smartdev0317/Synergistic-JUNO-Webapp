import { LOOP_GAUGE_VOTES, LOOP_GAUGE_VOTE_NOW, WYND_GAUGE_VOTES, WYND_GAUGE_VOTE_NOW } from 'constants/keyNames'
import { atom } from 'recoil'
import { LoopMultipleChoiceVote, WyndMultipleChoiceVote } from './types'
import { loopGaugeLpList } from 'constants/loopGauge'
import { wyndGaugeLpList } from 'constants/wyndGauge'

export const loopGaugeVoteNow = atom({
  key: LOOP_GAUGE_VOTE_NOW,
  default: 0,
})

export const loopGaugeVotes = atom<LoopMultipleChoiceVote[]>({
    key: LOOP_GAUGE_VOTES,
    default: loopGaugeLpList.map((each: any) => {
        return {
            pool: each.address,
            percentage: 0
        }
    })
})

export const wyndGaugeVoteNow = atom({
  key: WYND_GAUGE_VOTE_NOW,
  default: 0,
})

export const wyndGaugeVotes = atom<WyndMultipleChoiceVote[]>({
    key: WYND_GAUGE_VOTES,
    default: wyndGaugeLpList.map((each: any) => {
        return {
            option: each.address,
            weight: "0"
        }
    })
})
