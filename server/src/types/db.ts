export interface Provider {
  id: number;
  provider_name: string;
  provider_id: number;
  provider_token: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
}
