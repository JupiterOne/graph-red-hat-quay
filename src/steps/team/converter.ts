import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { RedHatQuayTeamDetails } from '../../types';
import { Entities } from '../constants';

export function getTeamKey(name: string): string {
  return `red_hat_quay_team:${name}`;
}

export function createTeamEntity(team: RedHatQuayTeamDetails): Entity {
  return createIntegrationEntity({
    entityData: {
      source: team,
      assign: {
        _key: getTeamKey(team.name),
        _type: Entities.TEAM._type,
        _class: Entities.TEAM._class,
        name: team.name,
        description: team.description,
        role: team.role,
        repoCount: team.repo_count,
        memberCount: team.member_count,
        isSynced: team.is_synced,
      },
    },
  });
}
