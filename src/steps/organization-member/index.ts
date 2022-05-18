import {
  createDirectRelationship,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { RedHatQuayOrganizationMember } from '../../types';
import { Steps, Entities, Relationships } from '../constants';
import { getTeamKey } from '../team/converter';
import {
  createOrganizationMemberEntity,
  getOrganizationMemberKey,
} from './converter';

export async function fetchOrganizationMembers({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.ORGANIZATION._type },
    async (organizationEntity) => {
      await apiClient.iterateOrganizationMembers(
        organizationEntity.name as string,
        async (organizationMember) => {
          let organizationMemberEntity = await jobState.findEntity(
            getOrganizationMemberKey(organizationMember.name),
          );

          if (!organizationMemberEntity) {
            organizationMemberEntity = await jobState.addEntity(
              createOrganizationMemberEntity(organizationMember),
            );
          }

          await jobState.addRelationship(
            createDirectRelationship({
              from: organizationEntity,
              to: organizationMemberEntity,
              _class: RelationshipClass.HAS,
            }),
          );
        },
      );
    },
  );
}

export async function buildOrganizationMemberTeamRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ORGANIZATION_MEMBER._type },
    async (organizationMemberEntity) => {
      const organizationMember = getRawData<RedHatQuayOrganizationMember>(
        organizationMemberEntity,
      );

      if (organizationMember) {
        for (const team of organizationMember.teams) {
          const teamEntity = await jobState.findEntity(getTeamKey(team.name));

          if (teamEntity) {
            await jobState.addRelationship(
              createDirectRelationship({
                from: teamEntity,
                to: organizationMemberEntity,
                _class: RelationshipClass.HAS,
              }),
            );
          }
        }
      }
    },
  );
}

export const organizationMemberSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ORGANIZATION_MEMBER,
    name: 'Fetch Organization Members',
    entities: [Entities.ORGANIZATION_MEMBER],
    relationships: [Relationships.ORGANIZATION_HAS_ORGANIZATION_MEMBER],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchOrganizationMembers,
  },
  {
    id: Steps.BUILD_ORGANIZATION_MEMBER_TEAM,
    name: 'Build Team and Organization Member Relationship',
    entities: [],
    relationships: [Relationships.TEAM_HAS_ORGANIZATION_MEMBER],
    dependsOn: [Steps.TEAM, Steps.ORGANIZATION_MEMBER],
    executionHandler: buildOrganizationMemberTeamRelationship,
  },
];
