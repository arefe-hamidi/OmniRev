export interface iLoginRequest {
  username_or_email: string; // Form field; sent as username to API
  password: string;
}

/** API request body: POST /auth/login */
export interface iLoginApiRequest {
  username: string;
  password: string;
}

export interface iLoginResponse {
  access: string;
  refresh?: string;
  user: {
    id?: number;
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}
