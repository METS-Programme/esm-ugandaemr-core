import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  triageRoomTag: {
    _type: Type.String,
    _description: 'This is triage room tag',
    _default: '3e525526-cd66-46ad-96b3-224d46e75676',
  },
  clinicalRoomTag: {
    _type: Type.String,
    _description: 'This is clinical room tag',
    _default: '96be1b53-e65c-494b-be41-b36899cb5d09',
  },
  showExtraVisitAttributesSlot: {
    _type: Type.Boolean,
    _description:
      'Whether on start visit form should handle submission of the extra visit attributes from the extra visit attributes slot',
    _default: false,
  },
};

export interface PatientQueueConfig {
  triageRoomTag: string;
  clinicalRoomTag: string;
  showExtraVisitAttributesSlot?: boolean;
}
