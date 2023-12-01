import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Stack,
  TextInput,
  InlineLoading,
  SelectSkeleton,
} from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getFacility,
  getGlobalPropertyValue,
  handleFacilityResponse,
  useGetResourceInformation,
} from './system-info.resources';
import { extractResourceInfo } from './system-info.utils';
import styles from './system-info.scss';
import { useConfig } from '@openmrs/esm-framework';

interface RetrieveFacilityCodeModalProps {
  closeModal: () => void;
  facilityCodeDetails: { value: string; uuid: string };
  setFacilityCodeDetails: (obj: {}) => void;
}

const RetrieveFacilityCodeModal: React.FC<RetrieveFacilityCodeModalProps> = ({
  closeModal,
  setFacilityCodeDetails,
  facilityCodeDetails,
}) => {
  const { t } = useTranslation();
  const config = useConfig();
  const { nhfrGlobalPropertyValueName } = config;

  const [careLevels, setCareLevels] = useState([]);
  const [ownership, setOwnership] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [code, setCode] = useState('');
  const [searchParams, setSearchParams] = useState({
    ownership: null,
    careLevel: null,
    facilityName: null,
  });

  const [facilityUrl, setFacilityUrl] = useState('');

  getGlobalPropertyValue(nhfrGlobalPropertyValueName)
    .then((resp) => {
      setFacilityUrl(resp?.data?.results[0].value);
    })
    .catch((error) => {
      console.info(error);
    });

  const { data: ownershipData } = useGetResourceInformation('ownership', facilityUrl);
  const { data: careLevelsData } = useGetResourceInformation('careLevel', facilityUrl);

  useEffect(() => {
    if (Object.keys(careLevelsData).length) {
      setCareLevels(extractResourceInfo(careLevelsData['entry']));
    }
    if (Object.keys(ownershipData).length) {
      setOwnership(extractResourceInfo(ownershipData['entry']));
    }
  }, [careLevelsData, ownershipData]);

  useEffect(() => {
    if (code) {
      const selectedFacility = facilities.filter((f) => f['code'] === code)[0];
      setCode(selectedFacility.code);
    }
  }, [code, facilities]);

  const handleAddFacilityCode = () => {
    if (code) {
      setFacilityCodeDetails({
        ...facilityCodeDetails,
        value: code,
      });
    }
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // todo: validate form
    setFacilities([]);
    setCode('');
    setIsLoading(true);
    setShowResults(false);
    const response = await getFacility(searchParams, facilityUrl);
    const facilitiesArray = handleFacilityResponse(response);
    if (facilitiesArray[0]['id'] !== null) {
      setFacilities(facilitiesArray);
    }
    setShowResults(true);
    setIsLoading(false);
  };

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('addFacilityCode', 'Add Facility Code')} />
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Stack gap={7}>
            {/* care level */}
            {Object.keys(careLevelsData).length ? (
              <Select
                labelText={t('selectLevelOfCare', 'Select facility level')}
                id="careLevel"
                value={searchParams.careLevel}
                onChange={(event) => setSearchParams({ ...searchParams, careLevel: event.target.value })}
                light
              >
                <SelectItem key={'LevelOfCare'} text={'Choose Facility Level'} value={''} />
                {careLevels.map((level) => {
                  return (
                    <SelectItem key={level.code} text={level.display} value={level.code}>
                      {level.display}
                    </SelectItem>
                  );
                })}
              </Select>
            ) : (
              <SelectSkeleton />
            )}
            {/* ownership */}
            {Object.keys(ownershipData).length ? (
              <Select
                labelText={t('selectOwnershipType', 'Select ownership type')}
                id="ownership"
                invalidText="Required"
                value={searchParams.ownership}
                onChange={(event) => setSearchParams({ ...searchParams, ownership: event.target.value })}
                light
              >
                <SelectItem key={'OwnershipType'} text={'Choose ownership type'} value={''} />
                {ownership.map((type) => {
                  return (
                    <SelectItem key={type.code} text={type.display} value={type.code}>
                      {type.display}
                    </SelectItem>
                  );
                })}
              </Select>
            ) : (
              <SelectSkeleton />
            )}
            {/* facility name */}
            <TextInput
              id="facilityName"
              invalidText="Required"
              labelText={t('facilityName', 'Facility Name')}
              onChange={(event) => setSearchParams({ ...searchParams, facilityName: event.target.value })}
              value={searchParams.facilityName}
            />
            {isLoading ? (
              <InlineLoading description={t('loading', 'Loading...')} role="progressbar" />
            ) : (
              <Button type="submit">{t('searchForFacility', 'Search')}</Button>
            )}
          </Stack>
        </Form>
        {showResults ? (
          Object.keys(facilities).length > 0 ? (
            <div className={styles['results']}>
              <Select
                labelText={t('selectFacility', 'Select your facility')}
                id="facility"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                light
              >
                <SelectItem key={'chooseFacility'} text={'Facility Name'} value={''} />
                {facilities.map((facility) => {
                  return (
                    <SelectItem key={facility.id} text={facility.name} value={facility.code}>
                      {facility.name}
                    </SelectItem>
                  );
                })}
              </Select>
              <TextInput
                id="facilityCode"
                readOnly={true}
                labelText={t('facilityCode', 'Facility Code')}
                value={code}
              />
            </div>
          ) : (
            <p className={styles['no-results']}>{t('noMatch', 'No matching health facility found')}!</p>
          )
        ) : (
          ''
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button onClick={handleAddFacilityCode}>{t('addFacilityCode', 'Add Facility Code')}</Button>
      </ModalFooter>
    </div>
  );
};

export default RetrieveFacilityCodeModal;
