import { usePagination, useVisit } from '@openmrs/esm-framework';
import {
  ErrorState,
  launchPatientWorkspace,
  launchStartVisitPrompt,
  PatientChartPagination,
} from '@openmrs/esm-patient-common-lib';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  InlineLoading,
  Search,
} from 'carbon-components-react';
import { debounce } from 'lodash-es';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAvailableForms } from '../hooks/useForms';
import { Form } from '../types';

interface AvailableFormsProps {
  patientUuid: string;
  patient: fhir.Patient;
}

const AvailableForms: React.FC<AvailableFormsProps> = ({ patientUuid, patient }) => {
  const { t } = useTranslation();
  const headerData = useMemo(() => {
    return [
      {
        header: 'Form Name',
        key: 'formName',
      },
      {
        header: 'Version',
        key: 'version',
      },
    ];
  }, []);

  const { isLoading, availableForms, error } = useAvailableForms(patientUuid);
  const { currentVisit } = useVisit(patientUuid);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useMemo(() => debounce((searchTerm) => setSearchTerm(searchTerm), 400), []);

  const searchResults = useMemo(
    () =>
      searchTerm
        ? availableForms.filter((formInfo) => formInfo.name.toLowerCase().search(searchTerm?.toLowerCase()) !== -1)
        : availableForms,
    [availableForms, searchTerm],
  );

  const { results: formsToDisplay, goTo, currentPage } = usePagination(searchResults);

  const dataTableRows = useMemo(
    () => formsToDisplay.map((form) => ({ formName: form.name, version: form.version, id: form.uuid })),
    [formsToDisplay],
  );

  const handleLaunchFormEntry = useCallback(
    (form: Form) =>
      currentVisit
        ? launchPatientWorkspace('kenyaemr-form-workspace', {
            formUuid: form.uuid,
            patientUuid,
            patient,
            workspaceTitle: form.name,
          })
        : launchStartVisitPrompt(),
    [currentVisit, patient, patientUuid],
  );

  console.log(availableForms);

  if (isLoading) {
    return <InlineLoading description={t('loading', 'Loading...')} />;
  }

  if (error) {
    return <ErrorState headerTitle={t('errorLoadingForms', 'Error')} error={error} />;
  }

  return (
    <>
      <Search
        light
        placeholder={t('searchForAForm', 'Search for a form')}
        labelText={t('searchForForm', 'Search for form')}
        onChange={(event) => handleSearch(event.target.value)}
      />
      <DataTable rows={dataTableRows} headers={headerData}>
        {({ rows, headers, getHeaderProps, getTableProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow onClick={() => handleLaunchFormEntry(formsToDisplay[index])} key={row.id}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
      <PatientChartPagination
        totalItems={availableForms.length}
        pageSize={10}
        onPageNumberChange={({ page }) => goTo(page)}
        pageNumber={currentPage}
        dashboardLinkUrl=""
        currentItems={formsToDisplay.length}
        dashboardLinkLabel={''}
      />
    </>
  );
};

export default AvailableForms;
