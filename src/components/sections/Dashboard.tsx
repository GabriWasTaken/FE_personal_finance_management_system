import { QueryObserverSuccessResult, QueryObserverPlaceholderResult } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import React from 'react';

function Dashboard( {dataQuery, pagination, setPagination}: {dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>>} ) {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard