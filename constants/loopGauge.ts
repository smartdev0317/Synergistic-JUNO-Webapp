import loop from "components/images/png/loop.png"
import atom from "components/images/png/atom.png"
import usdc from "components/images/png/usdc.png"
import juno from "components/images/png/juno.png"
import sgnl from "components/images/png/sgnl.png"
import bjuno from "components/images/png/bjuno.png"
import osmo from "components/images/png/osmo.png"

export const ACTIVE_LOOP_GAUGE_PROPOSAL_ID = 2
export const ACTIVE_SYNERGISTIC_LOOP_GAUGE_PROPOSAL_ID = 1

export const loopGaugeLpList = [
    {
        tokens: [
            {
                symbol: "LOOP",
                icon: loop,
            },
            {
                symbol: "USDC",
                icon: usdc,
            }
        ],
        address: "juno17xudkf5a2m2nny7gqzss4wuges5v0ek035m3wzefp3a99x80kxasj5whwu",
    },
    {
        tokens: [
            {
                symbol: "LOOP",
                icon: loop,
            },
            {
                symbol: "JUNO",
                icon: juno,
            }
        ],
        address: "juno140h0ctxu0ete06a86u4has6ymppqpx30z6yfyumlkfwqjkv3grrs089el6",
    },
    {
        tokens: [
            {
                symbol: "LOOP",
                icon: loop,
            },
            {
                symbol: "ATOM",
                icon: atom,
            }
        ],
        address: "juno1kceqgs9hr4qt2ln87k6hqkgge6545cskpalyxjdyh99gr77kvw7szgctjx",
    },
    {
        tokens: [
            {
                symbol: "LOOP",
                icon: loop,
            },
            {
                symbol: "SGNL",
                icon: sgnl,
            }
        ],
        address: "juno1eu0cf0eeksxse8g2mgkarhxjfpx9mzmlkjpgmw6cn526sv92zf5shjmnz2",
    },
    {
        tokens: [
            {
                symbol: "bJUNO",
                icon: bjuno,
            },
            {
                symbol: "LOOP",
                icon: loop,
            }
        ],
        address: "juno1dp2t26a575e5v2dxs3um77k2fa39sk0nzw7qmvhrja5vc3q96rvshv0hw5",
    },
    {
        tokens: [
            {
                symbol: "OSMO",
                icon: osmo,
            },
            {
                symbol: "LOOP",
                icon: loop,
            }
        ],
        address: "juno14t6z9mclx6x47quvnv69hf3lr43d4p5dlvu925eg50t80eflh9eqcgsz80",
    },
]