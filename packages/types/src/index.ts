export interface LoginUser {
  username: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export interface Technician {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface CompleteToDerivation {
  id: number;
  userId: number;
  address: string;
  city: string;
  postalCode: string;
  createdAt: string;
}