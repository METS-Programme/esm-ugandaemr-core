import React, { useEffect, useState } from 'react';
import { Button, Select, SelectItem, TextInput, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useGetResourceInformation } from './system-info.resources';
import styles from './system-info.scss';

interface RetrieveFacilityCodeModalProps {
  closeModal: () => void;
  facilityCodeDetails: { value: string };
  setFacilityCodeDetails: (obj: {}) => void;
}

const RetrieveFacilityCodeModal: React.FC<RetrieveFacilityCodeModalProps> = ({
  closeModal,
  setFacilityCodeDetails,
  facilityCodeDetails,
}) => {
  const { t } = useTranslation();

  const [facilities, setFacilities] = useState([]);
  const [facilityCodes, setFacilityCodes] = useState({});
  const [code, setCode] = useState('');

  const [resource, setResource] = useState('Location');
  const [facilityName, setFacilityName] = useState('');
  const { data: suggestedFacilities } = useGetResourceInformation({ resource, name: facilityName });

  useEffect(() => {
    if (suggestedFacilities) {
      const facilityNames = suggestedFacilities.map((item) => item.resource.name);
      const facilityCodesMap = {};
      suggestedFacilities.forEach((item) => {
        const uniqueIdentifier = item.resource.extension.find((ext) => ext.url === 'uniqueIdentifier');
        if (uniqueIdentifier) {
          facilityCodesMap[item.resource.name] = uniqueIdentifier.valueString;
        }
      });
      setFacilities(facilityNames);
      setFacilityCodes(facilityCodesMap);
    }
  }, [suggestedFacilities]);

  const handleFacilityNameChange = (event) => {
    setFacilityName(event.target.value);
  };

  const handleSelectFacility = (event) => {
    const selectedFacilityName = event.target.value;
    setCode(facilityCodes[selectedFacilityName] || '');
  };

  const handleAddFacilityCode = () => {
    if (code) {
      setFacilityCodeDetails({
        ...facilityCodeDetails,
        value: code,
      });
    }
    closeModal();
  };

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('addFacilityCode', 'Add Facility Code')} />
      <ModalBody>
        <TextInput
          id="facilityName"
          value={facilityName}
          onChange={handleFacilityNameChange}
          placeholder={t('searchFacilityName', 'Search by Facility Name')}
          labelText={t('facilityName', 'Facility Name')}
        />
        {facilities.length > 0 && (
          <div className={styles['results']}>
            <Select
              labelText={t('selectFacility', 'Select your facility')}
              id="facility"
              value={code}
              onChange={handleSelectFacility}
              light
            >
              <SelectItem key={'chooseFacility'} text={'Facility Name'} value={''} />
              {facilities.map((facility, index) => (
                <SelectItem key={index} text={facility} value={facility}>
                  {facility}
                </SelectItem>
              ))}
            </Select>
            <TextInput id="facilityCode" readOnly={true} labelText={t('facilityCode', 'Facility Code')} value={code} />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button onClick={handleAddFacilityCode} disabled={code.length < 1}>
          {t('addFacilityCode', 'Add Facility Code')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default RetrieveFacilityCodeModal;
