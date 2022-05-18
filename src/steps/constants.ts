import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  ORGANIZATION: 'fetch-organizations',
  ORGANIZATION_MEMBER: 'fetch-organization-members',
  BUILD_ORGANIZATION_MEMBER_TEAM:
    'build-organization-member-team-relationships',
  TEAM: 'fetch-teams',
  REPOSITORY: 'fetch-repositories',
};

export const Entities: Record<
  'ACCOUNT' | 'ORGANIZATION' | 'ORGANIZATION_MEMBER' | 'TEAM' | 'REPOSITORY',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'red_hat_quay_account',
    _class: ['Account'],
    schema: {
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['name', 'email'],
    },
  },
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'red_hat_quay_organization',
    _class: ['Organization'],
  },
  ORGANIZATION_MEMBER: {
    resourceName: 'OrganizationMember',
    _type: 'red_hat_quay_organization_member',
    _class: ['User'],
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'red_hat_quay_team',
    _class: ['Team'],
  },
  REPOSITORY: {
    resourceName: 'Repository',
    _type: 'red_hat_quay_repository',
    _class: ['Repository'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_ORGANIZATION'
  | 'ORGANIZATION_HAS_ORGANIZATION_MEMBER'
  | 'ORGANIZATION_HAS_TEAM'
  | 'TEAM_HAS_ORGANIZATION_MEMBER'
  | 'ORGANIZATION_HAS_REPOSITORY',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_ORGANIZATION: {
    _type: 'red_hat_quay_account_has_organization',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ORGANIZATION._type,
  },
  ORGANIZATION_HAS_ORGANIZATION_MEMBER: {
    _type: 'red_hat_quay_organization_has_member',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ORGANIZATION_MEMBER._type,
  },
  ORGANIZATION_HAS_TEAM: {
    _type: 'red_hat_quay_organization_has_team',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.TEAM._type,
  },
  TEAM_HAS_ORGANIZATION_MEMBER: {
    _type: 'red_hat_quay_team_has_organization_member',
    sourceType: Entities.TEAM._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ORGANIZATION_MEMBER._type,
  },
  ORGANIZATION_HAS_REPOSITORY: {
    _type: 'red_hat_quay_organization_has_repository',
    sourceType: Entities.ORGANIZATION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPOSITORY._type,
  },
};
