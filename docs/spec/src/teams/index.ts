import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const teamSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/v1/organization/{organizationName}
     * PATTERN: Fetch Entities
     */
    id: 'fetch-teams',
    name: 'Fetch Teams',
    entities: [
      {
        resourceName: 'Team',
        _type: 'red_hat_quay_team',
        _class: ['Team'],
      },
    ],
    relationships: [
      {
        _type: 'red_hat_quay_organization_has_team',
        sourceType: 'red_hat_quay_organization',
        _class: RelationshipClass.HAS,
        targetType: 'red_hat_quay_team',
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
];
