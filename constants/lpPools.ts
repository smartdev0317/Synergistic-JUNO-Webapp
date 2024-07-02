import { LoopLpFarmDataType, WyndLpFarmDataType } from "data/types"
import { LOOP, WYND } from "./keyNames";

import loop from '/components/images/png/loop.png';
import juno from '/components/images/png/juno.png';
import bjuno from '/components/images/png/bjuno.png';
import seasy from '/components/images/png/seasy.png';
import wynd from '/components/images/png/wynd.png';

export const loopLpPools: LoopLpFarmDataType[] = [
    {
        name: "LOOP/JUNO",
        pair: "juno1qc8mrs3hmxm0genzrd92akja5r0v7mfm6uuwhktvzphhz9ygkp8ssl4q07",
        lpAddr: "juno140h0ctxu0ete06a86u4has6ymppqpx30z6yfyumlkfwqjkv3grrs089el6",
        lpDecimals: 6,
        flpAddr: "juno1z9pn2f92r75967lce824uywwjzqrh4cfgwtznldj9q65hzvntxjsk8gaxf",
        flpDecimals: 6,
        base: LOOP,
        asset0: {
            addr: "juno1qsrercqegvs4ye0yqg93knv73ye5dc3prqwd6jcdcuj8ggp6w0us66deup",
            decimals: 6,
            icon: loop,
            symbol: "LOOP",
        },
        asset1: {
            denom: "ujuno",
            decimals: 6,
            icon: juno,
            symbol: "JUNO",
        },
        rewards: [
            {
                addr: "juno1qsrercqegvs4ye0yqg93knv73ye5dc3prqwd6jcdcuj8ggp6w0us66deup",
                decimals: 6,
                icon: loop,
                symbol: "LOOP",
            }
        ]
    },
    {
        name: "bJUNO/JUNO",
        pair: "juno1e4gxx99ufal40jkrl90ucjlvuvns942xqg3ycu9gmw4nwgyrap8sk52ua8",
        lpAddr: "juno194m6qvjr424hzqax5kgx2racpg2gx4yeq3d8kg0dm0xte3e7hpvq7ceceu",
        lpDecimals: 6,
        flpAddr: "juno1tguedn0d7k8y7c6xys86zcqc40rcdrazyuw9ayc9vuue43y6zc6qj2xrzw",
        flpDecimals: 6,
        base: LOOP,
        asset0: {
            addr: "juno1wwnhkagvcd3tjz6f8vsdsw5plqnw8qy2aj3rrhqr2axvktzv9q2qz8jxn3",
            decimals: 6,
            icon: bjuno,
            symbol: "BJUNO",
        },
        asset1: {
            denom: "ujuno",
            decimals: 6,
            icon: juno,
            symbol: "JUNO",
        },
        rewards: [
            {
                addr: "juno1qsrercqegvs4ye0yqg93knv73ye5dc3prqwd6jcdcuj8ggp6w0us66deup",
                decimals: 6,
                icon: loop,
                symbol: "LOOP",
            },
            {
                addr: "juno19rqljkh95gh40s7qdx40ksx3zq5tm4qsmsrdz9smw668x9zdr3lqtg33mf",
                decimals: 6,
                icon: seasy,
                symbol: "SEASY",
            },
            {
                addr: "juno1wwnhkagvcd3tjz6f8vsdsw5plqnw8qy2aj3rrhqr2axvktzv9q2qz8jxn3",
                decimals: 6,
                icon: bjuno,
                symbol: "BJUNO",
            }
        ]
    }
]

export const wyndLpPools: WyndLpFarmDataType[] = [
    {
        name: "WYND/JUNO",
        pair: "juno1a7lmc8e04hcs4y2275cultvg83u636ult4pmnwktr6l9nhrh2e8qzxfdwf",
        lpAddr: "juno1stg339rrg9guqsuv205yayq2ttzwz4583luc9pznvexe7rtrtrksdxstg3",
        lpDecimals: 6,
        stakingAddr: "juno1zvxvs3tzfqd4eqt6g5dq9wsusy0ap5vk34nklqfl0u938sf3y7hql08umf",
        base: WYND,
        asset0: {
            addr: "juno1mkw83sv6c7sjdvsaplrzc8yaes9l42p4mhy0ssuxjnyzl87c9eps7ce3m9",
            decimals: 6,
            icon: wynd,
            symbol: "WYND",
        },
        asset1: {
            denom: "ujuno",
            decimals: 6,
            icon: juno,
            symbol: "JUNO",
        },
        rewards: [
            {
                addr: "ujuno",
                decimals: 6,
                icon: juno,
                symbol: "JUNO",
            },
            {
                addr: "juno1mkw83sv6c7sjdvsaplrzc8yaes9l42p4mhy0ssuxjnyzl87c9eps7ce3m9",
                decimals: 6,
                icon: wynd,
                symbol: "WYND",
            }
        ]
    },
]

export const LOOP_FARM_STAKEABLE_INFO = [
    {
        liquidity_token: "juno1z9pn2f92r75967lce824uywwjzqrh4cfgwtznldj9q65hzvntxjsk8gaxf",
        token: "juno140h0ctxu0ete06a86u4has6ymppqpx30z6yfyumlkfwqjkv3grrs089el6"
    },
    {
        liquidity_token: "juno1sw4h3da9pguqr3wq6y69lz7nctlhg50h0enrr04klnw8r97vtl8sqh7n8a",
        token: "juno14dfmj338xr5lcnnj2yuqp2f5y3ukn8kr8m2rygvrcw5npwfdz4ps6kqwjn"
    },
    {
        liquidity_token: "juno1qajnhwlngclmnkx2syw35pedgcpsgr3fjef052gykjcqg4lcde8svq4e6g",
        token: "juno14t6z9mclx6x47quvnv69hf3lr43d4p5dlvu925eg50t80eflh9eqcgsz80"
    },
    {
        liquidity_token: "juno1279m27gnsx7rky9az7mfvzt3npw3ncrpkw640rruc92d7ctkr3eqtm5xmt",
        token: "juno162vk72cy4psyt4f3axw32tyfswswgq37h2rl8gwf7mavdj4mchfqhljfuf"
    },
    {
        liquidity_token: "juno1q435929mr4whtkp7e5nwugyycdttaqmlsfadu7ehsulca3qa5ylqh7cnph",
        token: "juno17xudkf5a2m2nny7gqzss4wuges5v0ek035m3wzefp3a99x80kxasj5whwu"
    },
    {
        liquidity_token: "juno1tguedn0d7k8y7c6xys86zcqc40rcdrazyuw9ayc9vuue43y6zc6qj2xrzw",
        token: "juno194m6qvjr424hzqax5kgx2racpg2gx4yeq3d8kg0dm0xte3e7hpvq7ceceu"
    },
    {
        liquidity_token: "juno1q4y6cwvkcqkhmk6epc0v7kq4zrjstfcygm3mqefp406x75kmdtcsyca5ak",
        token: "juno1dp2t26a575e5v2dxs3um77k2fa39sk0nzw7qmvhrja5vc3q96rvshv0hw5"
    },
    {
        liquidity_token: "juno1fc8jh9lxv9ge2ysggjwcul6r8cvrsqud5gp3qy9fww7ueqsd250syy96rw",
        token: "juno1eu0cf0eeksxse8g2mgkarhxjfpx9mzmlkjpgmw6cn526sv92zf5shjmnz2"
    },
    {
        liquidity_token: "juno1kcwj8zzg08qtjewj6pe8dm6p7z5whgcf6efgrv3387d594z9c6fsl5dx9t",
        token: "juno1j488wlv52gklu8ctquywulmkfgymyzdqrzhpvh5kqvf2vyj53j7susthqx"
    },
    {
        liquidity_token: "juno1zrwlwlmuqfhptvkp56sakvxxrx65yfq7y7qjx6u3tls20n9e5grsswu9vx",
        token: "juno1kceqgs9hr4qt2ln87k6hqkgge6545cskpalyxjdyh99gr77kvw7szgctjx"
    },
    {
        liquidity_token: "juno1h9ka0uq9njgkkfy5ly3vlxjjwqz8h0cs5vj6gy24vme7mzx2pmrqv08qj4",
        token: "juno1skwwlvqdw2499spvzqjyr78tg3d0fxlw3ek0f2y6nnl7xcqe8r8syu42dt"
    },
]
