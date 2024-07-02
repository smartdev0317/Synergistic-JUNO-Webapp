import Link from 'next/link'
import { useRouter } from 'next/router'
import { Tooltip as ReactTooltip } from 'react-tooltip'

const Menu = () => {
  const router = useRouter()

  return (
    <div
      id="menu"
      className="fixed bottom-5 menu-bg-color border-menu z-[1000] px-[4px]"
    >
      <div className="flex">
        <Link href="/">
          <div className="flex w-[117px] justify-center items-center py-[1px]">
            <p
              className={`relative cursor-pointer ${
                router.pathname == '/'
                  ? 'font-menu-active menu-color-active'
                  : 'font-menu menu-color'
              }`}
            >
              Pools & Claim
            </p>
          </div>
        </Link>
        <span className="split-border my-[13px]" />
        <Link href="/stake">
          <div className="flex w-[117px] justify-center items-center py-[1px]">
            <p
              className={`relative cursor-pointer ${
                router.pathname == '/stake'
                  ? 'font-menu-active menu-color-active'
                  : 'font-menu menu-color'
              }`}
            >
              Stake
            </p>
          </div>
        </Link>
        <span className="split-border my-[13px]" />
        <Link href="/vote">
          <div className="flex w-[117px] justify-center items-center py-[1px]">
            <p
              className={`relative cursor-pointer ${
                router.pathname == '/vote'
                  ? 'font-menu-active menu-color-active'
                  : 'font-menu menu-color'
              }`}
            >
              Vote
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Menu
