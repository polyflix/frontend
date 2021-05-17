import { AlertType } from "../../ui/components/Alert/Alert.component";

export type UserState<T> = {
  isLoading: boolean;
  data: T | null;
  alert: { type: AlertType; message: string } | null;
};
