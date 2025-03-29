import React, { useEffect } from 'react'
import Layout from './Layout';
import { SiteMap } from '@/utils/siteMap';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';
import { PaginationState } from '@tanstack/react-table';
import { useLocation } from 'react-router';
import { useErrorManager } from '@/hooks/useErrorManager';

function AutenticatedHome({ component }: { component: SiteMap }) {

  const location = useLocation();
  const handleError = useErrorManager();

  const [pagination, setPagination] = React.useState<PaginationState & { id_account?: string }>({
    pageIndex: 0,
    pageSize: 10,
    id_account: undefined
  })

  const [locationPath, setLocationPath] = React.useState<string>('/');

  useEffect(() => {
    if (location.state) {
      setPagination((old) => ({ ...old, id_account: location.state.id_account }));
    }
    setLocationPath(location.pathname);
  }, [location]);

  const fetchPage = async (pagination: PaginationState & { id_account?: string }): Promise<unknown> => {
    const queryParams = `?page=${pagination.pageIndex}&limit=${pagination.pageSize}${pagination.id_account ? `&id_account=${pagination.id_account}` : ''}`;
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${component.path}${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
    if (!response.ok) {
      handleError({ error: response });
      throw new Error('Network response was not ok')
    }
    return response.json();
  }

  const dataQuery = useQuery({
    queryKey: [locationPath, pagination],
    queryFn: () => fetchPage(pagination),
    placeholderData: keepPreviousData,
  })

  if (dataQuery.isError) {
    return <Layout><span>Error: {dataQuery.error.message}</span></Layout>
  }

  return (
    <Layout>
      {dataQuery.isPending 
        ? <div className='px-8'><Skeleton className="w-full h-[20px] rounded-full" /></div>
        : <component.component dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
      }
    </Layout>
  );
}

export default AutenticatedHome