import { useLogto } from "@logto/react";
export function useErrorManager() {

  const {signOut} = useLogto();

  const handleError = ({ error }: { error: {status: number} }) => {
    if (error.status === 401) {
      localStorage.removeItem('token');
      signOut();
    }
  }

  return handleError
}
