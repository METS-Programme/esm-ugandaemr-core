import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

interface RegimenReason {
  category: string;
  reason: Array<Reason>;
}
interface Reason {
  label: string;
  value: string;
}

export const useRegimenReason = () => {
  const regimenReasonUrl = `${restBaseUrl}/ugandaemr/regimenReason`;
  const { data, error, isLoading } = useSWR<{ data: { results: Array<RegimenReason> } }>(
    regimenReasonUrl,
    openmrsFetch,
  );

  const regimenReason = data?.data?.results ? data?.data?.results : [];
  return { regimenReason, isLoading, error };
};
