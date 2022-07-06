import React, { useState } from 'react';
import { ContentSwitcher, Switch } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import AvailableForms from './forms/available-forms.component';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import styles from './root.scss';
import CompletedVisitForms from './forms/completed-form.component';

const enum FormsCategory {
  Available,
  Completed,
}

interface HomeProps {
  patientUuid: string;
  patient: fhir.Patient;
}

const Home: React.FC<HomeProps> = ({ patientUuid, patient }) => {
  const { t } = useTranslation();
  const [selectedFormCategory, setSelectedFormCategory] = useState(FormsCategory.Available);

  return (
    <div>
      <CardHeader title={t('forms', 'Forms')}>
        <div className={styles.contextSwitcherContainer}>
          <ContentSwitcher
            selectedIndex={selectedFormCategory}
            onChange={({ name }) => setSelectedFormCategory(name as any)}>
            <Switch name={FormsCategory.Available} text="Available" />
            <Switch name={FormsCategory.Completed} text="Completed" />
          </ContentSwitcher>
        </div>
      </CardHeader>
      {selectedFormCategory === FormsCategory.Available && (
        <AvailableForms patient={patient} patientUuid={patientUuid} />
      )}

      {selectedFormCategory === FormsCategory.Completed && (
        <CompletedVisitForms patient={patient} patientUuid={patientUuid} />
      )}
    </div>
  );
};

export default Home;
