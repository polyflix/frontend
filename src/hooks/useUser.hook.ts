import { useEffect, useState } from "react";
import User from "../models/user.model";
import { UserService } from "../services/user.service";
import { UserState } from "../types/users.type";
import { useAuth } from "./useAuth.hook";
import { AlertType } from "../components/Alert/Alert.component";
import { Token } from "../models/token.model";
import { useInjection } from "@modules/di";
import { StatusCodes } from "http-status-codes";

type UseUserHookOptions = {
  id?: string;
};

export const useUser = <T = User>(
  options: UseUserHookOptions
): UserState<T> => {
  const userService = useInjection<UserService>(UserService);
  const { token, isLoading: authLoading, user } = useAuth();
  const { id } = options;

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!id) return setData(user as any);
    setLoading(true);
    userService
      .getUser(token as Token, id)
      .then((data: any) => {
        setData(data);
      })
      .catch((err) => {
        if (err.status && err.status === StatusCodes.NOT_FOUND)
          setAlert({ type: "not-found", message: err.error || err });
        else setAlert({ type: "error", message: err.error || err });
      })
      .finally(() => setLoading(false));
  }, [authLoading, userService, id, token, user]);

  return { data, alert, isLoading: loading };
};
