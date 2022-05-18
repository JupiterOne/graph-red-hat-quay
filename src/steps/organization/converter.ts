import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { RedHatQuayOrganization } from '../../types';
import { Entities } from '../constants';

export function createOrganizationEntity(
  organization: RedHatQuayOrganization,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: organization,
      assign: {
        _key: `red_hat_quay_organization:${organization.name}`,
        _type: Entities.ORGANIZATION._type,
        _class: Entities.ORGANIZATION._class,
        name: organization.name,
        public: organization.public,
        preferredNamespace: organization.preferred_namespace,
      },
    },
  });
}
