import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const organizationMemberSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: /api/v1/organizations/{organizationName}/members
     * PATTERN: Fetch Entities
     */
    id: 'fetch-organization-members',
    name: 'Fetch Organization Members',
    entities: [
      {
        resourceName: 'OrganizationMember',
        _type: 'red_hat_quay_organization_member',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'red_hat_quay_organization_has_member',
        sourceType: 'red_hat_quay_organization',
        _class: RelationshipClass.HAS,
        targetType: 'red_hat_quay_organization_member',
      },
    ],
    dependsOn: ['fetch-organizations'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build relationships
     */
    id: 'build-organization-member-team-relationships',
    name: 'Build Team and Organization Member Relationship',
    entities: [],
    relationships: [
      {
        _type: 'red_hat_quay_team_has_organization_member',
        sourceType: 'red_hat_quay_team',
        _class: RelationshipClass.HAS,
        targetType: 'red_hat_quay_organization_member',
      },
    ],
    dependsOn: ['fetch-teams', 'fetch-organization-members'],
    implemented: true,
  },
];
