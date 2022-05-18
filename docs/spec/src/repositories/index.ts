import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const repositorySpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/v1/repository?namespace={organizationNamespace}
     * PATTERN: Fetch Entities
     */
    id: 'fetch-repositories',
    name: 'Fetch Repositories',
    entities: [
      {
        resourceName: 'Repository',
        _type: 'red_hat_quay_repository',
        _class: ['Repository'],
      },
    ],
    relationships: [
      {
        _type: 'red_hat_quay_organization_has_repository',
        sourceType: 'red_hat_quay_organization',
        _class: RelationshipClass.HAS,
        targetType: 'red_hat_quay_repository',
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
];
