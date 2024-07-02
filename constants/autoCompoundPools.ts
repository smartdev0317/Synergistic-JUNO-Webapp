import { AutoCompoundFarmDataType } from "data/types"
import bloop from '/components/images/png/bloop.png';
import bwynd from '/components/images/png/bwynd.png';
import { SYNERGISTIC_LOOP_STAKER, SYNERGISTIC_WYND_STAKER } from "./address";

export const autoCompoundPools: AutoCompoundFarmDataType[] = [
    {
        icon: bwynd,
        iconAlt: "bwynd",
        name: "bWYND",
        // auto: true,
        base: "Convert WYND",
        convert: {
            note: "Convert WYND to bWYND and stake it to earn protocol revenue + SYNE",
            detailTitle: "Converting WYND to bWYND is irreversible",
            detail: "You may stake and unstake bWYND tokens, but not convert them back to WYND via Synergistic. Exchange of bWYND for WYND can be done on Wynd.",
            linkText: "Go To Wynd",
            linkUrl: "https://app.wynddao.com/pools",
            baseToken: "WYND",
            description: "Converting and staking your bWYND will start earning rewards. There is no unstake period."
        },
        stake: {
            note: "Stake your bWYND to earn bWYND + SYNE",
            detailTitle: "Stake your bWYND",
            detail: "By staking bWYND you are earning at least 80% of WYND’s 2 year bond staking rewards, plus additional SYNE tokens via airdrop eligibility.",
            linkText: "Get bWYND here",
            linkUrl: "",
            baseToken: "bWYND",
            description: "Unstaking immediate"
        },
        claim: {
            note: "Claim your rewards",
            detailTitle: "Tokens:",
            description: "Claim all of the rewards you have accumulated since your last claim."
        },
        unstake: {
            note: "Unstake your bWYND",
            detailTitle: "Unstake bWYND",
            detail: "Unstaking your bWYND will return your deposited bWYND and your unclaimed bWYND rewards to your wallet.",
            baseToken: "bWYND",
            description: "Unstaking is immediate & pending rewards will automatically be claimed."
        },
        token: {
            address: "juno1mkw83sv6c7sjdvsaplrzc8yaes9l42p4mhy0ssuxjnyzl87c9eps7ce3m9",
            name: "WYND Token",
            symbol: "WYND",
            decimals: 6
        },
        btoken: {
            // address: "juno1wskwl5uppjctpx25tfqz0lswtc5hh233zrnf44h6pyvtss93x5cqzaecry",
            address: "juno1gfam69z6rv3cjcmdn75zcs6vmdpjmtmlgnuqp2l6p33t2lyg0rpqlcqg3t",
            name: "bWYND Token",
            symbol: "bWYND",
            decimals: 6
        },
        vault: "juno1sy9mlw47w44f94zea7g98y5ff4cvtc8rfv75jgwphlet83wlf4ssa050mv",
        // bvault: "juno1vl50vga8gj4pl7767clh32ucr5yfmq5w38qagmxwet4pez458ssq4xnhnh",
        bvault: "juno1k2qw0a47u4svnjluksu83rpxlppx7v9zj7mrkyqf0hzgjwqdz50s6ravu6",
        converterAndStaker: SYNERGISTIC_WYND_STAKER,
    },
    {
        icon: bloop,
        iconAlt: "bloop",
        name: "bLOOP",
        // auto: false,
        base: "Convert LOOP",
        convert: {
            note: "Convert LOOP to bLOOP and stake it to earn protocol revenue + SYNE",
            detailTitle: "Converting LOOP to bLOOP is irreversible",
            detail: "You may stake and unstake bLOOP tokens, but not convert them back to LOOP via Synergistic. Exchange of bLOOP for LOOP can be done on Loop Finance DEX.",
            linkText: "Go To Loop Finance DEX",
            linkUrl: "https://juno.loop.markets/farm",
            baseToken: "LOOP",
            description: "Converting and staking your bLOOP will start earning rewards. There is no unstake period."
        },
        stake: {
            note: "Stake your bLOOP to earn bLOOP + SYNE",
            detailTitle: "Stake your bLOOP",
            detail: "By staking bLOOP you are earning at least 80% of LOOP’s 1 year lock staking rewards, plus additional SYNE tokens via airdrop eligibility.",
            linkText: "Get bLOOP here",
            linkUrl: "",
            baseToken: "bLOOP",
            description: "Unstaking immediate"
        },
        claim: {
            note: "Claim your rewards",
            detailTitle: "Tokens:",
            description: "Claim all of the rewards you have accumulated since your last claim."
        },
        unstake: {
            note: "Unstake your bLOOP",
            detailTitle: "Unstake bLOOP",
            detail: "Unstaking your bLOOP will return your deposited bLOOP and your unclaimed bLOOP rewards to your wallet.",
            baseToken: "bLOOP",
            description: "Unstaking is immediate & pending rewards will automatically be claimed."
        },
        token: {
            address: "juno1qsrercqegvs4ye0yqg93knv73ye5dc3prqwd6jcdcuj8ggp6w0us66deup",
            name: "LOOP Token",
            symbol: "LOOP",
            decimals: 6
        },
        btoken: {
            // address: "juno1ap0pmh3ac4gwted94v08g0mjt564kre2lc8rnhun8gmdgfe63khqfl2dmw",
            // live test
            address: "juno1cj6qlyfasrvw66yn3w8pnjcj0q96sc2r6ekaely24cf98fh680dqrpw2gm",
            name: "bLOOP Token",
            symbol: "bLOOP",
            decimals: 6
        },
        vault: "juno1rl77a4jpwf5rzmk9d6krrjekukty0m207h0sky97ls7zwq06htdqq6eq7r",
        // bvault: "juno14mrpxvdnvc26lvn06kdpfpw3unzrqswg8n3q4xwd2gr27l82xrtsts96t6",
        converterAndStaker: SYNERGISTIC_LOOP_STAKER,
        // live test
        bvault: "juno1uchuqaasnet9mtt0aweuc7aaulx48j3pk8c4tze5psurrpj6hjsq32h2qy",
    },
]