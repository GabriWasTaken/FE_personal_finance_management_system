import React, { useEffect } from 'react'
import { useLogto } from '@logto/react';
import { useNavigate } from 'react-router';

function Home() {
  const { signIn, isAuthenticated, getIdTokenClaims } = useLogto();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims();
        console.log("claims", claims);
        navigate('/dashboard');
      } else {
        signIn(import.meta.env.VITE_LOGTO_URL_CALLBACK);
      }
    })();
  }, [getIdTokenClaims, isAuthenticated, signIn]);

  return <></>
}

export default Home