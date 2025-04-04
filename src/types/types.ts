export type Accounts = {
  rows: [{
    id: string,
    name: string
  }]
}

export type Categories = {
  rows: [{
    id: string,
    name: string
  }]
}

export type AddFinancialsProps = { 
  name: string,
  amount: number,
  id_account: number,
  id_category: number,
  id_subcategory: number,
  handleError: ({ error }: { error: { status: number } }) => void 
}