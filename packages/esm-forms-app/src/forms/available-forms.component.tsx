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
  DataTableSkeleton,
  Search,
} from 'carbon-components-react';
import { debounce } from 'lodash-es';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAvailableForms } from '../hooks/useForms';
import { Form } from '../types';
import EmptyFormView from './empty-form.component';
import styles from './forms.scss';

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

  const { results: formsToDisplay, goTo, currentPage } = usePagination(searchResults ?? []);

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

  if (isLoading) {
    return <DataTableSkeleton rowCount={5} />;
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
      {formsToDisplay.length > 0 ? (
        <div className={styles.formContainer}>
          <DataTable size="lg" rows={dataTableRows} headers={headerData}>
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <Table {...getTableProps()} useZebraStyles={true}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader style={{ height: '3rem' }} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleLaunchFormEntry(formsToDisplay[index])}
                      key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          <span className={styles.formLink}>{cell.value}</span>
                        </TableCell>
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
        </div>
      ) : (
        <EmptyFormView
          action={t('formSearchHint', 'Try searching for the form using an alternative name or keyword')}
        />
      )}
    </>
  );
};

export default AvailableForms;
