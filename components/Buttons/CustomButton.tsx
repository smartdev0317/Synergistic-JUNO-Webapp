export default function CustomButton({
  disabled,
  onClick,
  text,
  small,
}: {
  disabled: boolean
  onClick: Function
  text: string
  small?: boolean
}) {
  return (
    <button
      className={`${
        small
          ? 'border-12 font-13-17-700-hk w-full detail-btn-bg-color-4 px-[18px] py-[10px] disabled:opacity-50 whitespace-nowrap'
          : 'detail-btn-bg-color-4 border-button font-wallet w-full px-[24px] py-[12px] mb-[12px] disabled:opacity-50'
      }`}
      disabled={disabled}
      onClick={() => onClick()}
    >
      {text}
    </button>
  )
}
