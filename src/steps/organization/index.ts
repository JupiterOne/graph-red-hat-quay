import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createOrganizationEntity } from './converter';
import { ACCOUNT_ENTITY_KEY } from '../account';

export async function fetchOrganizations({
  jobState,
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateOrganizations(async (organization) => {
    const organizationEntity = await jobState.addEntity(
      createOrganizationEntity(organization),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        from: accountEntity,
        to: organizationEntity,
        _class: RelationshipClass.HAS,
      }),
    );
  });
}

export const organizationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ORGANIZATION,
    name: 'Fetch Organizations',
    entities: [Entities.ORGANIZATION],
    relationships: [Relationships.ACCOUNT_HAS_ORGANIZATION],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchOrganizations,
  },
];
