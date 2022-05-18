import fetch, { Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { retry } from '@lifeomic/attempt';

import { IntegrationConfig } from './config';
import {
  RedHatQuayOrganizationMember,
  RedHatQuayOrganization,
  RedHatQuayUser,
  RedHatQuayTeamDetails,
  RedHatQuayOrganizationDetails,
  RedHatQuayRepository,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private baseUri = `${this.config.hostname}/api/v1/`;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async request(uri: string, method?: 'GET'): Promise<Response> {
    try {
      const options = {
        method,
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      };

      // Handle rate-limiting
      const response = await retry(
        async () => {
          const res: Response = await fetch(uri, options);
          this.checkStatus(res);
          return res;
        },
        {
          delay: 5000,
          maxAttempts: 10,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            )
              context.abort();
          },
        },
      );

      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: err.status || err.type,
        statusText: err.statusText || err.code,
      });
    }
  }

  private async paginatedRequest<T>(
    uri: string,
    iteratee: ResourceIteratee<T>,
    resourceName: string,
    method?: 'GET',
  ): Promise<void> {
    try {
      let next_page = null;
      do {
        const response = await this.request(
          `${uri}${next_page ? `?next_page=${next_page}` : ''}`,
          method,
        );

        for (const resource of response[resourceName]) await iteratee(resource);
        next_page = response.next_page || null;
      } while (next_page);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: uri,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri('user/');
    try {
      await this.request(uri);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async getCurrentUser(): Promise<RedHatQuayUser> {
    return this.request(this.withBaseUri(`user/`));
  }

  public async getOrganization(
    organizationName: string,
  ): Promise<RedHatQuayOrganizationDetails> {
    return this.request(this.withBaseUri(`organization/${organizationName}`));
  }

  /**
   * Iterates each organization resource in the provider.
   *
   * @param iteratee receives each organization to produce entities/relationships
   */
  public async iterateOrganizations(
    iteratee: ResourceIteratee<RedHatQuayOrganization>,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();

    for (const organization of currentUser.organizations) {
      await iteratee(organization);
    }
  }

  /**
   * Iterates each organization member resource in the provider.
   *
   * @param iteratee receives each organization member to produce entities/relationships
   */
  public async iterateOrganizationMembers(
    organizationName: string,
    iteratee: ResourceIteratee<RedHatQuayOrganizationMember>,
  ): Promise<void> {
    await this.paginatedRequest<RedHatQuayOrganizationMember>(
      this.withBaseUri(`organization/${organizationName}/members`),
      iteratee,
      'members',
    );
  }

  /**
   * Iterates each team resource in the provider.
   *
   * @param iteratee receives each team to produce entities/relationships
   */
  public async iterateTeams(
    organizationName: string,
    iteratee: ResourceIteratee<RedHatQuayTeamDetails>,
  ): Promise<void> {
    const organization = await this.getOrganization(organizationName);

    for (const teamNames in organization.teams) {
      await iteratee(organization.teams[teamNames]);
    }
  }

  /**
   * Iterates each repository resource in the provider.
   *
   * @param iteratee receives each repository to produce entities/relationships
   */
  public async iterateRepositories(
    organizationNamespace: string,
    iteratee: ResourceIteratee<RedHatQuayRepository>,
  ): Promise<void> {
    const organization = await this.request(
      this.withBaseUri(`repository?namespace=${organizationNamespace}`),
    );

    for (const repository of organization.repositories) {
      await iteratee(repository);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
