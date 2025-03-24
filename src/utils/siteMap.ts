import { Home, Inbox, LucideProps } from "lucide-react";
import Dashboard from "@/components/sections/Dashboard";
import Accounts from "@/components/sections/Accounts";
import Financials from "@/components/sections/Financials";
import { JSX } from "react";
import { QueryObserverSuccessResult, QueryObserverPlaceholderResult } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";

/**
 * Represents the type of page.
 * - 'list': The table page.
 * - 'detail': The detail page.
 * - 'none': A page that does not fall into the above categories.
 */
type PageType = 'list' | 'detail' | 'none';

/**
 * Represents a site map entry, defining the structure and metadata for a page in the application.
 */
export type SiteMap = {
  /**
   * The position in sidebar
   */
  index: number;

  /**
   * The title of the page, typically used for display purposes.
   */
  title: string;

  /**
   * The URL where the page can be accessed, typically used for navigation.
   */
  path: string;

  /**
   * The icon component associated with the page, showed in sidebar.
   */
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

  /**
   * A tooltip showed when hovering over the icon in shrink sidebar.
   */
  tooltip: string;

  /**
   * The React component of the page.
   */
  component: ({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>> }) => JSX.Element;

  /**
   * The type of the page, which determines its purpose and behavior [list, detail, none].
   */
  pageType: PageType;

  /**
 * collapsable
 */
  collapsable: boolean;

};

const siteMap: SiteMap[] = [
  {
    index: 0,
    title: 'dashboard',
    path: '/dashboard',
    icon: Home,
    tooltip: 'Home',
    component: Dashboard,
    pageType: 'list',
    collapsable: false,
  },
  {
    index: 1,
    title: 'accounts',
    path: '/accounts',
    icon: Inbox,
    tooltip: 'Accounts',
    component: Accounts,
    pageType: 'list',
    collapsable: false,
  },
  {
    index: 2,
    title: 'financials',
    path: '/financials',
    icon: Inbox,
    tooltip: 'Financials',
    component: Financials,
    pageType: 'list',
    collapsable: false,
  },
];

export default siteMap;