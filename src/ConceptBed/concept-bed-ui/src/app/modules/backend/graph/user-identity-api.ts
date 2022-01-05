export interface UserIdentityApi {
  id: string;
  businessPhones: string[];
  userPrincipalName: string;
  displayName: string;
  givenName: string;
  surname: string;
  jobTitle: string | null;
  mail: string | null;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  '@odata.context': string;
}
