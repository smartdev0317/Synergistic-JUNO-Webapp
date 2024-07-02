import Image, { StaticImageData } from 'next/image'

interface PropsType {
  icon: StaticImageData
  iconAlt: string
  size: 'big' | 'md' | 'small'
  zIndex?: number
}

const TokenImg = ({ icon, iconAlt, size, zIndex }: PropsType) => {
  let width = 36
  if (size === 'md') {
    width = 32
  }
  if (size === 'small') {
    width = 28
  }
  return (
    <div
      className={`w-[${width}px] h-[${width}px] ${
        size === 'small' ? '-mr-[10px]' : 'relative'
      }`}
      style={zIndex ? { zIndex } : {}}
    >
      <Image src={icon} width={width} height={width} alt={iconAlt} />
    </div>
  )
}

export default TokenImg
