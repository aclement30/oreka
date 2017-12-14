export interface BaseUser {
  id: number;
}

export interface User extends BaseUser {
  name: string;
  email: string;
  token: string;
  firstName?: string;
  lastName?: string;
  initials?: string;
  image?: string;
  color?: string;
}
