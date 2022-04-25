import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { RedHatQuayUser } from '../../types';
import { Entities } from '../constants';

export function createAccountEntity(currentUser: RedHatQuayUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: currentUser,
      assign: {
        _key: `red_hat_quay_account:${currentUser.username}`,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: currentUser.username,
        email: currentUser.email,
      },
    },
  });
}
