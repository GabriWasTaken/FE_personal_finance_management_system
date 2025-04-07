import { AddFinancialsProps } from "@/types/types";
import { PaginationState } from "@tanstack/react-table";

export const addAccount = async ({ name, handleError }: { name: string, handleError: ({ error }: { error: { status: number } }) => void }) => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + '/accounts', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) {
    handleError({ error: response });
    throw new Error('Network response was not ok')
  }
  return response.json();
}

export const addFinancial = async ({ amount, name, id_account, id_category, id_subcategory, transactionDate, type, id_account_to, handleError }: AddFinancialsProps) => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + '/financials', {
    method: 'POST',
    body: JSON.stringify({ name, amount, id_account, id_category, id_subcategory, transactionDate, type, id_account_to }),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) {
    handleError({ error: response });
    throw new Error('Network response was not ok')
  }
  return response.json();
}

export const addCategory = async ({ category, handleError }: { category: string, handleError: ({ error }: { error: { status: number } }) => void }) => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + '/categories', {
    method: 'POST',
    body: JSON.stringify({ category }),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) {
    handleError({ error: response });
    throw new Error('Network response was not ok')
  }
  return response.json();
}

export const addSubcategory = async ({ subcategory, categoryId, handleError }: { subcategory: string, categoryId:string, handleError: ({ error }: { error: { status: number } }) => void }) => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + '/subcategories', {
    method: 'POST',
    body: JSON.stringify({ subcategory, categoryId }),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) {
    handleError({ error: response });
    throw new Error('Network response was not ok')
  }
  return response.json();
}

export const fetchPage = async (pagination: PaginationState, apiToCall: string, handleError: ({ error }: { error: { status: number } }) => void): Promise<unknown> => {
  const queryParams = `?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${apiToCall}${queryParams}`,
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


export const fetchSubcategories = async (pagination: PaginationState & { id_category: string }, apiToCall: string, handleError: ({ error }: { error: { status: number } }) => void): Promise<unknown> => {
  const queryParams = `?page=${pagination.pageIndex}&limit=${pagination.pageSize}&id_category=${pagination.id_category}`;
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${apiToCall}${queryParams}`,
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

export const deleteTransaction = async ( { id, handleError }: { id: number, handleError: ({ error }: { error: { status: number } }) => void } ) => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + '/financials?id=' + id, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!response.ok) {
    handleError({ error: response });
    throw new Error('Network response was not ok')
  }
  return response.json();
}