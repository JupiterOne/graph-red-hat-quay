import { accountSteps } from './account';
import { organizationSteps } from './organization';
import { organizationMemberSteps } from './organization-member';
import { teamSteps } from './team';
import { repositorySteps } from './repository';

const integrationSteps = [
  ...accountSteps,
  ...organizationSteps,
  ...organizationMemberSteps,
  ...teamSteps,
  ...repositorySteps,
];

export { integrationSteps };
