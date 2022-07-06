import { openmrsFetch } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { Form } from '../types';
import { useMemo } from 'react';

export const useAvailableForms = (patientUuid: string) => {
  const availableFormsUrl = `/ws/rest/v1/kenyaemr/availableforms?patientUuid=${patientUuid}`;
  const { data, error, mutate, isValidating } = useSWR<{ data: Array<Form> }>(availableFormsUrl, openmrsFetch);

  const availableForms = useMemo(() => data?.data ?? [], [data]);
  return { availableForms: availableForms, isLoading: !data && !error, error, mutate, isValidating };
};

export const useCompletedForms = (patientUuid: string) => {
  const availableFormsUrl = '/ws/rest/v1/kenyaemr/completedforms/';
  const { data, error, mutate } = useSWR<{ data: Array<Form> }>(
    `${availableFormsUrl}?patientUuid=${patientUuid}`,
    openmrsFetch,
  );

  const completedForms = useMemo(() => data?.data ?? [], [data]);
  return { completedForms, isLoading: !data && !error, error, mutate };
};
