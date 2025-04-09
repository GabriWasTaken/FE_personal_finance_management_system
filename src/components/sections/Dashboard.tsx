import { QueryObserverSuccessResult, QueryObserverPlaceholderResult } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import React from 'react';

type DashboardSuccessAPIReturn = {
  allTime: {
    total_income: number,
    total_expense: number
  },
  YTD: {
    total_income: number,
    total_expense: number
  },
  prevYear: {
    total_income: number,
    total_expense: number
  }

}

function Dashboard({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<DashboardSuccessAPIReturn, Error> | QueryObserverPlaceholderResult<DashboardSuccessAPIReturn, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>> }) {
  if (!dataQuery.data.allTime || !dataQuery.data.YTD || !dataQuery.data.prevYear) return <div>Loading...</div>;
  return (
    <div>
      Dashboard
      {dataQuery.data &&
        <div>
          All time income: {dataQuery.data.allTime.total_income} <br />
          All time expenses: {dataQuery.data.allTime.total_expense} <br />
          YTD income: {dataQuery.data.YTD.total_income} <br />
          YTD expenses: {dataQuery.data.YTD.total_expense} <br />
          prev year income: {dataQuery.data.prevYear.total_income} <br />
          prev year expenses: {dataQuery.data.prevYear.total_expense}
        </div>
      }
    </div>
  )
}

export default Dashboard