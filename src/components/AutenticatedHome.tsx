import React from 'react'
import Layout from './Layout';
import { SiteMap } from '@/utils/siteMap';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';
import { PaginationState } from '@tanstack/react-table';

function AutenticatedHome({ component }: { component: SiteMap }) {

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchPage = (pagination: PaginationState): Promise<unknown> => {
    return fetch(`${import.meta.env.VITE_BASE_URL}${component.path}?page=${pagination.pageIndex}&limit=${pagination.pageSize}&id_account=${pagination.id_account}`).then(res => res.json());
  }

  const dataQuery = useQuery({
    queryKey: ['data', pagination],
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