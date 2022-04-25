export type RedHatQuayAvatar = {
  name: string;
  hash: string;
  color: string;
  kind: string;
};

export type RedHatQuayOrganization = {
  name: string;
  avatar: RedHatQuayAvatar;
  public: boolean;
  preferred_namespace: boolean;
};

export type RedHatQuayUser = {
  anonymous: boolean;
  username: string;
  avatar: RedHatQuayAvatar;
  can_create_repo: boolean;
  is_me: boolean;
  verified: boolean;
  email: string;
  logins: [];
  invoice_email: boolean;
  invoice_email_address?: string;
  preferred_namespace: boolean;
  tag_expiration_s: number;
  company?: string;
  family_name?: string;
  given_name?: string;
  location?: string;
  is_free_account: boolean;
  has_password_set: boolean;
  organizations: RedHatQuayOrganization[];
};

export type RedHatQuayTeam = {
  name: string;
  avatar: {
    name: string;
    hash: string;
    color: string;
    kind: string;
  };
};

export type RedHatQuayTeamDetails = {
  name: string;
  description: string;
  role: string;
  avatar: RedHatQuayAvatar;
  can_view: boolean;
  repo_count: number;
  member_count: number;
  is_synced: boolean;
};

export type RedHatQuayOrganizationDetails = {
  name: string;
  email: string;
  avatar: RedHatQuayAvatar;
  is_admin: boolean;
  is_member: boolean;
  teams: {
    [key: string]: RedHatQuayTeamDetails;
  };
  ordered_teams: string[];
  invoice_email: boolean;
  invoice_email_address?: string;
  tag_expiration_s: number;
  is_free_account: boolean;
};

export type RedHatQuayOrganizationMember = {
  name: string;
  kind: string;
  avatar: RedHatQuayAvatar;
  teams: RedHatQuayTeam[];
  repositories: string[];
};

export type RedHatQuayRepository = {
  namespace: string;
  name: string;
  description: string;
  is_public: boolean;
  kind: string;
  state: string;
  is_starred: boolean;
};
