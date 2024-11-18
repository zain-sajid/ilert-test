import useSWR from 'swr';
import { fetcherWithAuthHeader } from '@/lib/fetcher';

type useSWRWithContextOptions = {
  url: string;
  teamContext?: number;
};

type useSWRWithContextResponse<Data> = {
  data: Data | undefined;
  isLoading: boolean;
  error: any;
};

export function useSWRWithContext<Data>({
  url,
  teamContext
}: useSWRWithContextOptions): useSWRWithContextResponse<Data> {
  const { data, error, isLoading } = useSWR<Data>(
    [url, teamContext],
    ([url, teamContext]) =>
      fetcherWithAuthHeader(url, teamContext as number | undefined)
  );

  return { data, isLoading, error };
}
