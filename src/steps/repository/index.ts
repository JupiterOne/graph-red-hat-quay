import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createRepositoryEntity } from './converter';

export async function fetchRepositories({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.ORGANIZATION._type },
    async (organizationEntity) => {
      await apiClient.iterateRepositories(
        organizationEntity.name as string,
        async (repository) => {
          const repositoryEntity = await jobState.addEntity(
            createRepositoryEntity(repository),
          );

          await jobState.addRelationship(
            createDirectRelationship({
              from: organizationEntity,
              to: repositoryEntity,
              _class: RelationshipClass.HAS,
            }),
          );
        },
      );
    },
  );
}

export const repositorySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.REPOSITORY,
    name: 'Fetch Repositories',
    entities: [Entities.REPOSITORY],
    relationships: [Relationships.ORGANIZATION_HAS_REPOSITORY],
    dependsOn: [Steps.ORGANIZATION],
    executionHandler: fetchRepositories,
  },
];
