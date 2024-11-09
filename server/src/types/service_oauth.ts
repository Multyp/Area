type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export interface AuthorizationRequest {
  baseUrl: string;

  queries: {
    [key: string]: string | string[];
  };
}

export interface TokenRequest {
  baseUrl: string;

  headers?: {
    [key: string]: string;
  };

  data: {
    [key: string]: string;
  };
}

export interface UserIdRequest {
  baseUrl: string;
  method?: HttpMethod;

  headers?: {
    [key: string]: string;
  };

  data?: {
    [key: string]: string;
  };

  parseResponse: (response: any) => any;
}

export interface ServiceOAuth {
  description: string;
  getAuthorizationRequest: (redirect_uri: string) => AuthorizationRequest;
  getTokenRequest: (redirect_uri: string, code: string) => TokenRequest;
  getUserIdRequest: (token: string, instance_url?: string) => UserIdRequest;
}
