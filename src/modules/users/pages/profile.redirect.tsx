import { Redirect, useParams } from "react-router-dom";
import { useAuth } from "../../authentication/hooks/useAuth.hook";
import { UserVideosPage } from "./videos/index.page";

export const ProfileRedirector: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  if (+id === user?.id) return <Redirect to="/profile/videos" />;
  return <UserVideosPage />;
};
