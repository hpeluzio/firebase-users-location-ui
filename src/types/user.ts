export interface User {
  id?: string;
  name: string;
  zipCode: string;
}

export interface CreateUserRequest {
  name: string;
  zipCode: string;
}

export interface UpdateUserRequest {
  name?: string;
  zipCode?: string;
} 