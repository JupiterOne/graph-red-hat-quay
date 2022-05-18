import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/v1/user
     * PATTERN: Fetch Entities
     */
    id: 'fetch-organizations',
    name: 'Fetch Organizations',
    entities: [
      {
        resourceName: 'Organization',
        _type: 'red_hat_quay_organization',
        _class: ['Organization'],
      },
    ],
    relationships: [
      {
        _type: 'red_hat_quay_account_has_organization',
        sourceType: 'red_hat_quay_account',
        _class: RelationshipClass.HAS,
        targetType: 'red_hat_quay_organization',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
