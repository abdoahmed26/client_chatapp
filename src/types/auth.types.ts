export interface IUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  provider: "local" | "google";
  role?: string;
}

export interface IAuthState {
  token: string | null;
  user: IUser | null;
  isLoading: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginResponse {
  status: string;
  data:{ token: string; user: IUser }
}

export interface IRegisterResponse {
  token: string;
  user: IUser;
}

/** Request payload for PATCH /users/:id (profile update). */
export interface IUpdateProfilePayload {
  name?: string;
  profileImage?: File;
}
