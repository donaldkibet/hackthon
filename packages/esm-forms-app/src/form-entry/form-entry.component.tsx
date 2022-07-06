import { ExtensionSlot, useVisit } from '@openmrs/esm-framework';
import { DefaultWorkspaceProps } from '@openmrs/esm-patient-common-lib';
import { InlineLoading } from 'carbon-components-react';
import React from 'react';

interface FormEntryProps extends DefaultWorkspaceProps {
  patientUuid: string;
  formUuid: string;
  patient: fhir.Patient;
}

const FormEntry: React.FC<FormEntryProps> = ({ patientUuid, formUuid, patient, closeWorkspace }) => {
  const { currentVisit, isLoading } = useVisit(patientUuid);

  if (isLoading) {
    return <InlineLoading />;
  }

  return (
    <ExtensionSlot
      extensionSlotName="form-widget-slot"
      state={{
        view: 'form',
        patient,
        patientUuid,
        visitTypeUuid: currentVisit?.visitType.uuid,
        visitUuid: currentVisit.uuid,
        closeWorkspace,
        formUuid,
        encounterUuid: '',
      }}
    />
  );
};

export default FormEntry;
