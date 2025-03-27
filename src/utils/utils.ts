import { useLogto } from "@logto/react";
export const languages = ['en', 'it'];

export const handleApiError = (err: any) => {
  if (err.status === 401) {
    localStorage.removeItem('token');
    useLogto().signOut();
  }
};

