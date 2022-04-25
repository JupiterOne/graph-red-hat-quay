import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { organizationSpec } from './organizations';
import { organizationMemberSpec } from './organization-members';
import { teamSpec } from './teams';
import { repositorySpec } from './repositories';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...organizationSpec,
    ...organizationMemberSpec,
    ...teamSpec,
    ...repositorySpec,
  ],
};
