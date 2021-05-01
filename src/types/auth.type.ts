import { Token } from "../models/token.model";
import User from "../models/user.model";
import { GenericAction } from "./generic.type";

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAccountActivated: boolean;
  isAdmin: boolean;
}

export interface IRegisterForm extends ILoginForm {
  firstName: string;
  lastName: string;
  passwordConfirm: string;
}

export type AuthState = {
  isLoading: boolean;
  hasRefresh: boolean;
  isAuthenticated: boolean;
  user: User | null;
  token: Token | null;
  authError: string | null;
};

export type AuthAction = GenericAction<AuthState>;
