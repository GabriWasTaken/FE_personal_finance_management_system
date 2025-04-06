import { useLogto } from "@logto/react";
import { toast } from "sonner"

export function useErrorManager() {

  const {getIdToken, getAccessToken} = useLogto();

  const handleError = ({ error }: { error: {status: number} }) => {
    if (error.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');

      async function retrieveLogtoInfo() {
        const accessToken = await getAccessToken();
        const token = await getIdToken();
        if (token) localStorage.setItem("token", token);
        if (accessToken) localStorage.setItem("accessToken", accessToken);
      }
      retrieveLogtoInfo();
    }
    toast.error("error");
  }

  return handleError
}
