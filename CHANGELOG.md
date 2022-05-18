# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Ingest new entities
  - `red_hat_quay_account`
  - `red_hat_quay_organization`
  - `red_hat_quay_organization_member`
  - `red_hat_quay_repository`
  - `red_hat_quay_team`
- Build new relationships
  - `red_hat_quay_account_has_organization`
  - `red_hat_quay_organization_has_member`
  - `red_hat_quay_organization_has_repository`
  - `red_hat_quay_organization_has_team`
  - `red_hat_quay_team_has_organization_member`
