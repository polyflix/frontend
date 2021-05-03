import { useAuth } from "@core/hooks/useAuth.hook";
import { Redirect, useParams } from "react-router-dom";
import UserVideosPage from "./videos/index.page";

const ProfileRedirector: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  if (id && parseInt(id) === user?.id) return <Redirect to="/profile/videos" />;
  return <UserVideosPage />;
};

export default ProfileRedirector;
