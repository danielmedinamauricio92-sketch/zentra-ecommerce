export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

export interface AuthUser {
  user: User;
}
