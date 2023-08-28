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
import { getFacility, handleFacilityResponse, useGetResourceInformation } from './system-info.resource';
import { extractResourceInfo } from './facility-modals.utils';

interface RetrieveFacilityCodeModalProps {
  closeModal: () => void;
  setFacilityCode: (message: string) => void;
}

const RetrieveFacilityCodeModal: React.FC<RetrieveFacilityCodeModalProps> = ({ setFacilityCode, closeModal }) => {
  const { t } = useTranslation();
  const [careLevels, setCareLevels] = useState([]);
  const [ownership, setOwnership] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [facility, setFacility] = useState('');
  const [code, setCode] = useState('');
  const [searchParams, setSearchParams] = useState({
    ownership: null,
    careLevel: null,
    facilityName: null,
  });

  const { data: ownershipData } = useGetResourceInformation('ownership');
  const { data: careLevelsData } = useGetResourceInformation('careLevel');

  useEffect(() => {
    if (Object.keys(careLevelsData).length) {
      setCareLevels(extractResourceInfo(careLevelsData['entry']));
    }
    if (Object.keys(ownershipData).length) {
      setOwnership(extractResourceInfo(ownershipData['entry']));
    }
  }, [careLevelsData, ownershipData]);

  useEffect(() => {
    if (facility) {
      const selectedFacility = facilities.filter((f) => f['code'] === facility)[0];
      setCode(selectedFacility.code);
      setFacilityCode(selectedFacility.code);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilities, facility]);

  const handleAddFacilityCode = () => {
    setFacilityCode(facility);
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // todo: validate form
    setFacilities([]);
    setFacility('');
    setIsLoading(true);
    setShowResults(false);
    const response = await getFacility(searchParams);
    setFacilities(handleFacilityResponse(response));
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
                <SelectItem key={'LoC'} text={'Choose Facility Level'} value={''} />
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
                <SelectItem key={'OT'} text={'Choose ownership type'} value={''} />
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
              <Button type="submit">search for facility</Button>
            )}
          </Stack>
        </Form>
        {showResults ? (
          Object.keys(facilities).length > 0 ? (
            <>
              <Select
                labelText={t('selectFacility', 'Select your facility')}
                id="facility"
                value={facility}
                onChange={(event) => setFacility(event.target.value)}
                light
              >
                <SelectItem key={'chooseFacility'} text={'Choose your facility'} value={''} />
                {facilities.map((facility) => {
                  return (
                    <SelectItem key={facility.id} text={facility.name} value={facility.code}>
                      {facility.name}
                    </SelectItem>
                  );
                })}
              </Select>
              <p>{code}</p>
            </>
          ) : (
            <p>No matching health facility found</p>
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
