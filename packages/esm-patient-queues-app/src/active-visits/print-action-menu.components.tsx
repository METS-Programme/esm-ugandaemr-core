import { Button } from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import VisitCardToPrint from '../active-visits-print/active-visits-print.component';
import { MappedPatientQueueEntry } from './patient-queues.resource';

interface PrintActionsMenuProps {
  patient: MappedPatientQueueEntry;
}

const PrintActionsMenu: React.FC<PrintActionsMenuProps> = ({ patient }) => {
  const { t } = useTranslation();
  const [isPrinting, setIsPrinting] = useState(false);

  const contentToPrintRef = useRef(null);

  const onBeforeGetContentResolve = useRef(null);

  useEffect(() => {
    if (onBeforeGetContentResolve.current) {
      onBeforeGetContentResolve.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => contentToPrintRef.current,
    onBeforeGetContent: () =>
      new Promise((resolve) => {
        onBeforeGetContentResolve.current = resolve;
        setIsPrinting(true);
      }),
    onAfterPrint: () => {
      onBeforeGetContentResolve.current = null;
      setIsPrinting(false);
    },
  });

  return (
    <div>
      <div ref={contentToPrintRef}>
        <VisitCardToPrint queueEntry={patient} />
        <Button
          kind="ghost"
          onClick={handlePrint}
          iconDescription={t('printVisit', 'Print Visit')}
          renderIcon={(props) => <Printer size={16} {...props} />}
        />
      </div>
    </div>
  );
};
export default PrintActionsMenu;
