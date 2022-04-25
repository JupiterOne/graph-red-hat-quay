# Development

This integration focuses on Red Hat Quay and is using
[Red Hat Quay API](https://access.redhat.com/documentation/en-us/red_hat_quay/3.6/html/red_hat_quay_api_guide/index)
for interacting with the Red Hat Quay resources.

## Provider account setup

1. Deploy a Red Hat Quay as a POC instance by following
   [this document](https://access.redhat.com/documentation/en-us/red_hat_quay/3.6/html/deploy_red_hat_quay_for_proof-of-concept_non-production_purposes/index).
2. [Create and OAuth Access Token](https://access.redhat.com/documentation/en-us/red_hat_quay/3/html/red_hat_quay_api_guide/using_the_red_hat_quay_api#create_oauth_access_token)

   1. Log in to Red Hat Quay and select your Organization (or create a new one).
   2. Select the Applications icon from the left navigation.
   3. Select Create New Application and give the new application a name when
      prompted.
   4. Select the new application.
   5. Select Generate Token from the left navigation.
   6. Select the checkboxes to set the scope of the token and select Generate
      Access Token.
   7. Review the permissions you are allowing and select Authorize Application
      to approve it.
   8. Copy the newly generated token to use to access the API.

## Permissions

Access token must have the `user:admin`, `org:admin`, `repo:read`, `user:read`
permissions

## Authentication

Provide the `ACCESS_KEY`, `HOSTNAME` (format is:
"http://example.redhatquay.com") to the `.env`. You can use
[`.env.example`](../.env.example) as a reference.

The Access Key will be used to authorize requests as a Bearer Token.
