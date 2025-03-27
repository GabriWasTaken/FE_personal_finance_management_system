import React from 'react'
import Layout from './Layout';
import { SiteMap } from '@/utils/siteMap';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';
import { PaginationState } from '@tanstack/react-table';
import { useLocation } from 'react-router';
import { handleApiError } from '@/utils/utils';

function AutenticatedHome({ component }: { component: SiteMap }) {

  const [pagination, setPagination] = React.useState<PaginationState & { id_account?: string }>({
    pageIndex: 0,
    pageSize: 10,
    id_account: undefined
  })

  const location = useLocation();

  const fetchPage = (pagination: PaginationState & { id_account?: string }): Promise<unknown> => {
    const queryParams = `?page=${pagination.pageIndex}&limit=${pagination.pageSize}${pagination.id_account ? `&id_account=${pagination.id_account}` : ''}`;
    return fetch(`${import.meta.env.VITE_BASE_URL}${component.path}${queryParams}`, 
      { 
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }, 
      }).then(res => res.json()).catch(err => handleApiError(err));
  }

  const dataQuery = useQuery({
    queryKey: [location.pathname, pagination],
    queryFn: () => fetchPage(pagination),
    placeholderData: keepPreviousData,
  })

  if (dataQuery.isError) {
    return <Layout><span>Error: {dataQuery.error.message}</span></Layout>
  }

  return (
    <Layout>
      {dataQuery.isPending ? <div className='px-8'><Skeleton className="w-full h-[20px] rounded-full"/></div> :
        <>
          <component.component dataQuery={dataQuery} pagination={pagination} setPagination={setPagination}/>
        </>}
    </Layout>
  );
}

export default AutenticatedHome