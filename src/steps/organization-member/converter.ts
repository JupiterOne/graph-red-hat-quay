import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { RedHatQuayOrganizationMember } from '../../types';
import { Entities } from '../constants';

export function getOrganizationMemberKey(name: string): string {
  return `red_hat_quay_organization_member:${name}`;
}

export function createOrganizationMemberEntity(
  organizationMember: RedHatQuayOrganizationMember,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: organizationMember,
      assign: {
        _key: getOrganizationMemberKey(organizationMember.name),
        _type: Entities.ORGANIZATION_MEMBER._type,
        _class: Entities.ORGANIZATION_MEMBER._class,
        username: organizationMember.name,
        name: organizationMember.name,
        kind: organizationMember.kind,
        active: true,
      },
    },
  });
}
