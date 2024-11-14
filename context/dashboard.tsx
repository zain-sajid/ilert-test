import { createContext } from 'react';

type DashboardContextType = {
  addWidgetToDashboard: (type: string) => void;
};

export const DashboardContext = createContext<DashboardContextType>(
  {} as DashboardContextType
);
