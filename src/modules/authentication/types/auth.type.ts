import { GenericAction } from "../../common/types/generic.type";
import { User } from "../../users/models/user.model";
import { Token } from "../models/token.model";

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IResetRequestForm {
  email: string;
  redirect: string;
}

export interface IResetPasswordForm {
  newPassword: string;
  passwordConfirm: string;
  token: string;
  email: string;
}
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  isAccountActivated: boolean;
  isAdmin: boolean;
}

export interface IRegisterForm extends ILoginForm {
  firstName: string;
  lastName: string;
  passwordConfirm: string;
  redirect: string;
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
