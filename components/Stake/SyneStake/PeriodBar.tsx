import { STAKING_PERIODS } from 'constants/setting'
import { Slider } from 'rsuite'

const PeriodBar = ({
  period,
  onChange,
}: {
  period: number
  onChange: Function
}) => {
  let index = Object.values(STAKING_PERIODS).indexOf(period)
  let width = `${(100 / (Object.keys(STAKING_PERIODS).length - 1)) * index}%`
  if (index === -1) index = 0

  return (
    <div className="relative w-full px-[13px] mt-[15px] mb-[40px]">
      <Slider
        progress
        min={0}
        max={Object.values(STAKING_PERIODS).length - 1}
        value={index}
        className="customSlider"
        onChange={(value: number) => {
          onChange(Object.values(STAKING_PERIODS)[value])
        }}
        tooltip={false}
      />
      <div className="grid grid-cols-5 mt-[10px]">
        <div className="colspan-1 flex flex-col items-start">
          <div className="w-0 h-[10px] opacity-30 indicate-border" />
          <p className="font-12-18-500-ipm tertiary-color">
            1 month
          </p>
        </div>
        <div className="colspan-1 flex flex-col items-center">
          <div className="w-full flex justify-center -translate-x-1/4">
            <div className="w-0 h-[10px] opacity-30 indicate-border" />
          </div>
          <div className="w-full flex justify-center -translate-x-[16%]">
            <p className="font-12-18-500-ipm tertiary-color">3 months</p>
          </div>
        </div>
        <div className="colspan-1 flex flex-col items-center">
          <div className="w-0 h-[10px] opacity-30 indicate-border" />
          <p className="font-12-18-500-ipm tertiary-color">6 months</p>
        </div>
        <div className="colspan-1 flex flex-col items-center">
          <div className="w-full flex justify-center translate-x-1/4">
            <div className="w-0 h-[10px] opacity-30 indicate-border" />
          </div>
          <div className="w-full flex justify-center translate-x-[18.5%]">
            <p className="font-12-18-500-ipm tertiary-color">1 year</p>
          </div>
        </div>
        <div className="colspan-1 flex flex-col items-end">
          <div className="w-0 h-[10px] opacity-30 indicate-border" />
          <p className="font-12-18-500-ipm tertiary-color">
            2 years
          </p>
        </div>
      </div>
    </div>
  )
}

export default PeriodBar
