import atom from "components/images/png/atom.png"
import usdc from "components/images/png/usdc.png"
import juno from "components/images/png/juno.png"
import sgnl from "components/images/png/sgnl.png"
import bjuno from "components/images/png/bjuno.png"
import osmo from "components/images/png/osmo.png"
import wynd from "components/images/png/wynd.png"
import ampjuno from "components/images/svg/ampJuno.svg"
import czar from "components/images/png/czar.png"
import glto from "components/images/png/glto.png"
import mars from "components/images/png/mars.png"
import sejuno from "components/images/png/sejuno.png"
import aqua from "components/images/png/aqua.png"
import muse from "components/images/png/muse.png"
import howl from "components/images/png/howl.png"
import kleo from "components/images/png/kleo.png"
import stars from "components/images/png/stars.png"
import casa from "components/images/png/casa.png"
import weth from "components/images/png/weth.png"
import canlab from "components/images/png/canlab.png"
import wyjuno from "components/images/png/wyjuno.png"
import phmn from "components/images/png/phmn.png"
import rac from "components/images/png/rac.png"
import neta from "components/images/png/neta.png"
import seasy from "components/images/png/seasy.png"

export const ACTIVE_WYND_GAUGE_PROPOSAL_ID = 0
export const ACTIVE_SYNERGISTIC_WYND_GAUGE_PROPOSAL_ID = 0
export const UNBONDING_PERIOD = 3628800

export const wyndGaugeLpList = [
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "ampJUNO",
                icon: ampjuno,
            }
        ],
        address: "juno10sc6f842cguwrekeca40k9lpcsrt5r8hc6zpx60d43r9tpxxm00qftj50t",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "CZAR",
                icon: czar,
            }
        ],
        address: "juno122kx9l5z9lld74hjka0mg7exwxuwj2d0plwx03pwg3z4433vct8s4e9jr8",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "GLTO",
                icon: glto,
            }
        ],
        address: "juno14l8dhtl8rfwu4d97q6mp0ycnnhlrhssgjknkr2p9e34g0nxvcczqlur0yp",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "MARS",
                icon: mars,
            }
        ],
        address: "juno14qa84053dlc2ydgq32wq2ymkcgr67k0dtwjn503en58cfdr9s2rqmue6h0",
    },
    {
        tokens: [
            {
                symbol: "ATOM",
                icon: atom,
            },
            {
                symbol: "SEJUNO",
                icon: sejuno,
            }
        ],
        address: "juno153a72ges9fq52kvutgztr59udxhv4eq025p5za3xl0yvq22a7j8qfw6pmp",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "CZAR",
                icon: czar,
            }
        ],
        address: "juno15aqhjcm4x886pje3ae8mxl46wft5spuwp3fpcscz0x2g6n00dqns49v22y",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "AQU",
                icon: wynd,
            }
        ],
        address: "juno164cd6wpepkxp4ndwkvwe9nqp9krc37lwn70t7xy3h7jaa4ypeksszu2w3w",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "MUSE",
                icon: muse,
            }
        ],
        address: "juno182rvmpzq2hcvsr0xqnugvm4tz59l7hdgkhnnqnwklc3th8wmxxcsxeu5fx",
    },
    {
        tokens: [
            {
                symbol: "HOWL",
                icon: howl,
            },
            {
                symbol: "WYND",
                icon: wynd,
            }
        ],
        address: "juno19jayj30q6t8ruu58q8ayj7py5czzf9pm84s25qs3pnuakd5a50cswc5m2c",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "OSMO",
                icon: osmo,
            }
        ],
        address: "juno1d0mqxg0glg2u47q0uvcvw33fg8l5yg9vx5ean3qg3n3ng4tenecs4a7guy",
    },
    {
        tokens: [
            {
                symbol: "KLEO",
                icon: kleo,
            },
            {
                symbol: "JUNO",
                icon: juno,
            }
        ],
        address: "juno1d4qcgcc0yw65e7cyw3vta80s0wvttn2p3uwzhq0hyamjtt96ytwsl0mvlt",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "ATOM",
                icon: atom,
            }
        ],
        address: "juno1dhl0fxmkwp9m8m0c2mhqhs8utcpswp8ud9eh448ex9cjmqkm96zqa52m7p",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "STARS",
                icon: stars,
            }
        ],
        address: "juno1dqaqj5xzlm2pz3x54cc40hwkurradm6fgjj83pp8qkjrqht2y7pqg6ch6l",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "MARS",
                icon: mars,
            }
        ],
        address: "juno1fpgrwgz78uhxfudv0ay78veutwftxhm6zsfw27m7c7c28je6n87qd25f80",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "CASA",
                icon: casa,
            }
        ],
        address: "juno1gwp34xxvu2zwee4e6d5uqlp9sd635c5swgg2qmhtel8et4mngcast5jf96",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "wETH",
                icon: weth,
            }
        ],
        address: "juno1jl2l7rs2arevjhjccr7n7etvcfuakfu304fx4k0m9n7pahxf67hsw6egaa",
    },
    {
        tokens: [
            {
                symbol: "ATOM",
                icon: atom,
            },
            {
                symbol: "SEJUNO",
                icon: sejuno,
            }
        ],
        address: "juno1kzpq7ynt44yrkt2uhej4v4km6a0g8dc3t6m4r7j95n4dm7na3sjq7mdtna",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "BJUNO",
                icon: bjuno,
            }
        ],
        address: "juno1l2auxggxa5n9yled8zrf4zxtahergzgs2t9vykf66uckwwk9n3zq2j3yq7",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "CANLAB",
                icon: canlab,
            }
        ],
        address: "juno1l6vy80rm9x2r63rgcj5u3an7ge035udu986jf2dm65mx8yz0hw6su64ghn",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "RAC",
                icon: rac,
            }
        ],
        address: "juno1lkek4vzhum6vx4v36akftzqw60ul76lmrktkzl84quf3wq66uctqy734aj",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "AQUA",
                icon: aqua,
            }
        ],
        address: "juno1n9nylsg6jdcdjc7m5f29kycdpy9xhjgd68kh2vn8j7xztqruxy4sgwlaul",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "ATOM",
                icon: atom,
            }
        ],
        address: "juno1nfs4xjxum3fqd564yxj44ragxmh8ey7ugl50avquyt7zrvcwlf8q3juqqg",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "CASA",
                icon: casa,
            }
        ],
        address: "juno1p0xfltk5m85eqtuc5q5xsf3nf8zkpc635sf6wsay7nqg9vakeznsk9ll0r",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "USDC",
                icon: usdc,
            }
        ],
        address: "juno1pawjm34dunptcs8wt2m5tgcyexyzc02pdl9xl52jvcqlpwcgus5sen5yrk",
    },
    {
        tokens: [
            {
                symbol: "wyJUNO",
                icon: wyjuno,
            },
            {
                symbol: "JUNO",
                icon: juno,
            }
        ],
        address: "juno1qkqah87ks56v20nqwtjvrfa08p85d8qszjd9zck7h6ln37mzrsksgy7fh9",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "SGNL",
                icon: sgnl,
            }
        ],
        address: "juno1r2haw70fwu0z8s5n6em5gd097f8mplyxqs5uz3zch69h3llk64xssqp64l",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "SEJUNO",
                icon: sejuno,
            }
        ],
        address: "juno1shgke28jvl3ycfdlkx0mkvnmrunlvujd80q7zk499s9vx0zcqcvs2zsz3y",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "PHMN",
                icon: phmn,
            }
        ],
        address: "juno1sjkc38sy6aj3e8jerr40nhqm5xdcdc99ejtp46smjxs63tk3dj5svg0kqt",
    },
    {
        tokens: [
            {
                symbol: "HOWL",
                icon: howl,
            },
            {
                symbol: "JUNO",
                icon: juno,
            }
        ],
        address: "juno1tfryulnedmfs9hqs9hyvupramfddv90pz3dpp7h886tl6kuftflskypwh7",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "NETA",
                icon: neta,
            }
        ],
        address: "juno1tlhf68k8aksl30mdf5yngudk6z8w4qqzvvauzr92w3gwm7er9p9qxvudu7",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "OSMO",
                icon: osmo,
            }
        ],
        address: "juno1u4h488kf6xhmelsuwm0gj7dhh8mfjm7n5pyu8c0l0xwy3pvrpc3ql2p6q2",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "SEASY",
                icon: seasy,
            }
        ],
        address: "juno1un4052t70d64zj3qepch5qehqymuy653kqzgrl8eqzf3ns0p4kassg7pea",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "USDC",
                icon: usdc,
            }
        ],
        address: "juno1vntf38qmdx9aqskjnxdpcmtap0gymtcxnyf3pjcvn8a63j8q53tssrgzz8",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "ampJUNO",
                icon: ampjuno,
            }
        ],
        address: "juno1w0xpg7mwfh3wjkfv90gyu7k4vqwnepcwe9mletyjsk9lpwlvqg7qseq6v3",
    },
    {
        tokens: [
            {
                symbol: "JUNO",
                icon: juno,
            },
            {
                symbol: "CANLAB",
                icon: canlab,
            }
        ],
        address: "juno1wjcak50p8y7ajyu5n4u88s8ah58fa520442flthy7dq55v6fatqqrd395z",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "AQU",
                icon: wynd,
            }
        ],
        address: "juno1y4w2wt56km2htw6un5rsejts0gvgem5u4t7my4mq45rsjk4xvltqvhg0sj",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "AQUA",
                icon: aqua,
            }
        ],
        address: "juno1zhe3sptqs7ajcxy725fnd6ar9mtj67rzjfmad6zldyn92n6mfj5qztqr4u",
    },
    {
        tokens: [
            {
                symbol: "WYND",
                icon: wynd,
            },
            {
                symbol: "JUNO",
                icon: juno,
            }
        ],
        address: "juno1zvxvs3tzfqd4eqt6g5dq9wsusy0ap5vk34nklqfl0u938sf3y7hql08umf",
    },
]