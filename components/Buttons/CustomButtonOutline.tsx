export default function CustomButtonOutline({
  disabled,
  onClick,
  text,
  small,
  whitespace,
}: {
  disabled: boolean
  onClick: Function
  text: string
  small?: boolean
  whitespace?: boolean
}) {
  return (
    <button
      type="button"
      className={`${
        small
          ? 'border-12 font-13-17-700-hk px-[18px]'
          : 'border-button font-wallet mb-[12px] px-[24px]'
      } w-full py-[10px] btn-border disabled:bg-transparent disabled:opacity-50 ${whitespace ? 'whitespace-nowrap' : ''}`}
      disabled={disabled}
      onClick={() => onClick()}
    >
      {text}
    </button>
  )
}
