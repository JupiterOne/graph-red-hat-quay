import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';

import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-organization-members', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-organization-members',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.ORGANIZATION_MEMBER);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-organization-member-team-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-organization-member-team-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(
    Steps.BUILD_ORGANIZATION_MEMBER_TEAM,
  );
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
