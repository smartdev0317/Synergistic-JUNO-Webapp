import { WYND, LOOP, SYNE, VESYNE } from "./keyNames"
import wynd from "components/images/png/wynd.png"
import loop from "components/images/png/loop.png"
import syne from "components/images/png/syne.png"
import vesyne from "components/images/png/vesyne.png"

export const defaultTokenLists = [
    {
        address: "juno1mkw83sv6c7sjdvsaplrzc8yaes9l42p4mhy0ssuxjnyzl87c9eps7ce3m9",
        name: "WYND Token",
        symbol: WYND,
        decimals: 6,
        icon: wynd
    },
    {
        address: "juno1qsrercqegvs4ye0yqg93knv73ye5dc3prqwd6jcdcuj8ggp6w0us66deup",
        name: "LOOP Token",
        symbol: LOOP,
        decimals: 6,
        icon: loop
    },
    {
        // address: "juno1q0xfgjyptqzf9gjmg8ylg83ffzv2ngrufsghfcxztc2q2vztgp9skp3033",
        // live test
        address: "juno1q2qh0h725lr44vhnnw8y3r26vmr9r8sukrw958kyzn0vncatlp9s3gkaed",
        name: "SYNE Token",
        symbol: SYNE,
        decimals: 6,
        icon: syne
    },
    {
        // address: "juno1v8s7d4m0fy24r09leama584lthufe098pzhdlfca8srpztrujvzqs592yn",
        // live test
        address: "juno1prk0nlfg0fm3mtyzc9cn5uzkfnrkwk5uw3y2tujd8cpaa7l5u3tsuynyfg",
        name: "veSYNE Token",
        symbol: VESYNE,
        decimals: 6,
        icon: vesyne
    },
]
