import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { RedHatQuayRepository } from '../../types';
import { Entities } from '../constants';

export function createRepositoryEntity(
  repository: RedHatQuayRepository,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: repository,
      assign: {
        _key: `red_hat_quay_repository:${repository.name}`,
        _type: Entities.REPOSITORY._type,
        _class: Entities.REPOSITORY._class,
        name: repository.name,
        namespace: repository.namespace,
        description: repository.description,
        isPublic: repository.is_public,
        kind: repository.kind,
        state: repository.state,
        isStarred: repository.is_starred,
      },
    },
  });
}
