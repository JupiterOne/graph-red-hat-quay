import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { integrationConfig } from '../test/config';
import { setupProjectRecording } from '../test/recording';
import { IntegrationConfig, validateInvocation } from './config';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Config requires all of {hostname, accessToken}',
    );
  });

  /**
   * Testing a successful authorization can be done with recordings
   */
  test('successfully validates invocation', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'validate-invocation',
    });

    // Pass integrationConfig to authenticate with real credentials
    const executionContext = createMockExecutionContext({
      instanceConfig: integrationConfig,
    });

    // successful validateInvocation doesn't throw errors and will be undefined
    await expect(validateInvocation(executionContext)).resolves.toBeUndefined();
  });

  /* Adding `describe` blocks segments the tests into logical sections
   * and makes the output of `yarn test --verbose` provide meaningful
   * to project information to future maintainers.
   */
  describe('fails validating invocation', () => {
    /**
     * Testing failing authorizations can be done with recordings as well.
     * For each possible failure case, a test can be made to ensure that
     * error messaging is expected and clear to end-users
     */
    describe('invalid user credentials', () => {
      test('should throw if hostname is invalid', async () => {
        recording = setupProjectRecording({
          directory: __dirname,
          name: 'hostname-auth-error',
          // Many authorization failures will return non-200 responses
          // and `recordFailedRequest: true` is needed to capture these responses
          options: {
            recordFailedRequests: true,
            matchRequestsBy: {
              url: {
                hostname: false,
              },
            },
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            hostname: 'http://invalid',
            accessToken: integrationConfig.accessToken,
          },
        });

        // tests validate that invalid configurations throw an error
        // with an appropriate and expected message.
        expect.assertions(1);
        await validateInvocation(executionContext).catch((err) => {
          expect(err.status).toBe('system');
        });
      });

      test('should throw if clientSecret is invalid', async () => {
        recording = setupProjectRecording({
          directory: __dirname,
          name: 'client-secret-auth-error',
          options: {
            recordFailedRequests: true,
            matchRequestsBy: {
              url: {
                hostname: false,
              },
            },
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            hostname: integrationConfig.hostname,
            accessToken: 'INVALID',
          },
        });

        expect.assertions(1);
        await validateInvocation(executionContext).catch((err) =>
          expect(err.status).toBe(401),
        );
      });
    });
  });
});
