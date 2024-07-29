import { useSearchParams } from 'react-router-dom'
import { IQueryParams } from '../types/types'
function useQueryParams(): IQueryParams {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}

export default useQueryParams
