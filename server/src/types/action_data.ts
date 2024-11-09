export type ActionResult = {
  is_response_ended?: boolean;
  provided_user_id?: number; // Internal user ID.
  input?: {
    [key: string]: string;
  };
  nonce?: string; // (Optional) Nonce to ignore duplicated events sent on webhooks.
};

export type ActionData = {
  user: {
    id: number;
  };
  provided_user: {
    id: string;
    email?: string;
    token: string;
  };
  input?: {
    [key: string]: string;
  };
};
