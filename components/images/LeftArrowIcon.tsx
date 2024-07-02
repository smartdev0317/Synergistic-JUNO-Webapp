interface PropsType {
  width: string
}

const LeftArrowIcon = ({ width }: PropsType) => {
  return (
    <svg
      width={width}
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.125 14.625L15.75 9M15.75 9L10.125 3.375M15.75 9H2.25"
        stroke="#8B91F9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LeftArrowIcon
