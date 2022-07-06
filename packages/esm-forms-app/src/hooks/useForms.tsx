import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { Form } from '../types';
import { useMemo } from 'react';

interface FormsResponse {
  results: Array<Form>;
}
export const useAvailableForms = (patientUuid: string) => {
  const availableFormsUrl = `/ws/rest/v1/kenyaemr/availableforms?patientUuid=${patientUuid}`;
  const { data, error, mutate, isValidating } = useSWR<{ data: FormsResponse }>(availableFormsUrl, openmrsFetch);

  const availableForms = useMemo(() => data?.data?.results ?? [], [data]);
  return { availableForms, isLoading: !data && !error, error, mutate, isValidating };
};

export const useCompletedForms = (patientUuid: string) => {
  const availableFormsUrl = '/ws/rest/v1/kenyaemr/completedforms/';
  const { data, error, mutate } = useSWR<{ data: FormsResponse }>(
    `${availableFormsUrl}?patientUuid=${patientUuid}`,
    openmrsFetch,
  );

  const completedForms = useMemo(() => data?.data?.results ?? [], [data]);
  return { completedForms, isLoading: !data && !error, error, mutate };
};
