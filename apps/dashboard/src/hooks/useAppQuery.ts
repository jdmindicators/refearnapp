import {
  useQuery,
  UseQueryResult,
  QueryObserverResult,
} from "@tanstack/react-query"
import { ActionResult } from "@/lib/types/organization/response"
type QueryKeyPrimitive = string | number | boolean | null | undefined | object
interface UseAppQueryOptions {
  enabled?: boolean
  staleTime?: number
  gcTime?: number
}
type AppQueryResponse<T> = {
  data?: T
  toast?: string
}
interface AppQueryResult<TData> {
  data: TData | undefined
  error: string | undefined
  isError: boolean
  isPending: boolean
  refetch: () => Promise<QueryObserverResult<AppQueryResponse<TData>, Error>>
  queryResult: UseQueryResult<{ data?: TData; toast?: string }>
}

export function useAppQuery<Args extends unknown[], TData>(
  queryKey: readonly QueryKeyPrimitive[],
  fetchFn: (...args: Args) => Promise<ActionResult<TData>>,
  fetchArgs: Args,
  options?: UseAppQueryOptions
): AppQueryResult<TData> {
  const queryResult = useQuery<{ data?: TData; toast?: string }>({
    queryKey,
    queryFn: async () => {
      const res = await fetchFn(...fetchArgs)
      if (res.ok) return { data: res.data }
      return { toast: res.toast }
    },
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: false,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    gcTime: options?.gcTime ?? 5 * 60 * 1000,
  })

  return {
    data: queryResult.data?.data,
    error: queryResult.data?.toast,
    isError: queryResult.isError || !!queryResult.data?.toast,
    isPending: queryResult.isPending,
    refetch: queryResult.refetch,
    queryResult,
  }
}
