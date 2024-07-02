import LogoIcon from './images/LogoIcon'

const Logo = () => {
  return (
    <div className="flex items-center absolute top-0 left-0 h-full">
      <LogoIcon />
      <p className="font-logo ml-2">Synergistic</p>
    </div>
  )
}

export default Logo
