import { useQueryClient } from 'react-query'

import { APR } from 'constants/keyNames'

interface PropsType {
  type: string
  base: string
  pair: string
}

const Apr = ({ type, base, pair }: PropsType) => {
  const queryClient = useQueryClient()
  const apr: string = queryClient.getQueryData([type, base, pair, APR]) || '0'
  return (
    <p
      className={`${
        apr && Number(apr) > 0 ? 'apr-color-1' : 'apr-color-2'
      } font-td-3`}
    >
      {apr}%
    </p>
  )
}

export default Apr
