/* eslint-disable react/react-in-jsx-scope */
import { LogtoProvider, LogtoConfig } from '@logto/react';
import './App.css'
import AppRouter from './components/AppRouter';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


function App() {
  const config: LogtoConfig = {
    endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
    appId: import.meta.env.VITE_LOGTO_APPID,
    resources: [import.meta.env.VITE_LOGTO_RESOURCES],
  };
  const queryClient = new QueryClient();

  return (
    <LogtoProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </LogtoProvider>
  )
}

export default App
