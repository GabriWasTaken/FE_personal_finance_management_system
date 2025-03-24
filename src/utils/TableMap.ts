export type TableMap = {
  siteMapId: string;
  columns: string[];
};

const tableMap: TableMap[] = [
  {
    siteMapId: 'Customers',
    columns: ['name', 'email', 'actions'],
  }
];

export default tableMap;