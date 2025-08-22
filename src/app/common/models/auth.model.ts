export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
}
export interface LoginRequest {
  email: string;
  password: string;
  isPersistent: boolean;
}
export interface AuthResponse {
  userName: string;
  roles: string[];
}
