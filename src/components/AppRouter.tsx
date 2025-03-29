import React, { JSX, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { LoginCallback } from './login/LoginCallback';
import Home from './Home';
import AutenticatedHome from './AutenticatedHome';
import { useLogto } from '@logto/react';
import siteMap from '@/utils/siteMap';
import Loader from './ui/Loader';

function AppRouter() {
  const { isAuthenticated, isLoading, getIdToken, getAccessToken } = useLogto();

  useEffect(() => {
    async function retrieveLogtoInfo() {
      const accessToken = await getAccessToken();
      const token = await getIdToken();
      if (token) localStorage.setItem("token", token);
      if (accessToken) localStorage.setItem("accessToken", accessToken);
    }
    if(isAuthenticated){
      retrieveLogtoInfo();
    }
  }, [])

  if (isLoading) {
    return <Loader />;
  }

  const renderSitemapRoutes: () => JSX.Element[] = () => {
    return siteMap.map(element => {
      return (  
      <Route
        key={element.title}
        path={element.pageType === 'detail' ? `${element.path}/:id` : element.path}
        element={isAuthenticated ? <AutenticatedHome component={element} /> : <Navigate to="/" />}
      />
    );
    })
  }

  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/callback" element={<LoginCallback />} />
        <Route path="/" element={<Home />} />
        {renderSitemapRoutes()}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter