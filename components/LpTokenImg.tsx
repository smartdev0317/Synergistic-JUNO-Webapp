import Image, { StaticImageData } from 'next/image'

interface PropsType {
  icon1: StaticImageData
  icon2: StaticImageData
  icon1Alt: string
  icon2Alt: string
}

const LpTokenImg = ({ icon1, icon2, icon1Alt, icon2Alt }: PropsType) => {
  return (
    <div className="flex items-center">
      <div className="-mr-[6px] relative z-10">
        <Image src={icon1} alt={icon1Alt} width={'25'} height={'25'} />
      </div>
      <div>
        <Image src={icon2} alt={icon2Alt} width={'25'} height={'25'} />
      </div>
    </div>
  )
}

export default LpTokenImg
