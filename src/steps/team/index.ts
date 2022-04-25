import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createTeamEntity, getTeamKey } from './converter';

export async function fetchTeams({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.ORGANIZATION._type },
    async (organizationEntity) => {
      await apiClient.iterateTeams(
        organizationEntity.name as string,
        async (team) => {
          let teamEntity = await jobState.findEntity(getTeamKey(team.name));

          if (!teamEntity) {
            teamEntity = await jobState.addEntity(createTeamEntity(team));
          }
          await jobState.addRelationship(
            createDirectRelationship({
              from: organizationEntity,
              to: teamEntity,
              _class: RelationshipClass.HAS,
            }),
          );
        },
      );
    },
  );
}

export const teamSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.TEAM,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [Relationships.ORGANIZATION_HAS_TEAM],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchTeams,
  },
];
