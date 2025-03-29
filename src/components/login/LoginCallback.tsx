import React from 'react';
import { useHandleSignInCallback } from '@logto/react';
import { useNavigate } from 'react-router';
import { useLogto } from '@logto/react';

export const LoginCallback = () => {
  const navigate = useNavigate();
  const { getIdToken, getIdTokenClaims, getAccessToken } = useLogto();

  const { isLoading } = useHandleSignInCallback(() => {
    
    const retrieveLogtoInfo = async () => {
      const accessToken = await getAccessToken();
      const idToken = await getIdToken();
      const claims = await getIdTokenClaims();
      if (idToken) localStorage.setItem("token", idToken);
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if(claims?.username) localStorage.setItem("username", claims?.username);
    }
    retrieveLogtoInfo();
    navigate("/dashboard");
    // Navigate to root path when finished
  });

  // When it's working in progress
  if (isLoading) {
    return <div>Redirecting...</div>;
  }

  return null;
};