interface PropsType {
  checked: boolean
  toggleStatus: Function
}

const ToggleBtn = ({ checked, toggleStatus }: PropsType) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggleStatus()}
      />
      <span className="slider round"></span>
    </label>
  )
}

export default ToggleBtn
