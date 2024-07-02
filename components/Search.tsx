import Image from 'next/image'
import SearchIcon from '/components/images/png/Search.png'

interface PropsType {
  className: string
  value: string
  onChange: Function
}

const Search = ({ className, value, onChange }: PropsType) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-[16px] top-[10px]">
        <Image src={SearchIcon} width={20} height={20} alt={''} />
      </div>
      <input
        className="w-full search-bg-color outline-0 font-td-3 h-[40px] pl-[44px] border-search"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default Search
