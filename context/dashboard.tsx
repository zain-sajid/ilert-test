import { createContext, use, useContext } from 'react';

type DashboardContextType = {
  addWidgetToDashboard: (type: string) => void;
  teamContext: number | undefined;
};

export const DashboardContext = createContext<DashboardContextType>(
  {} as DashboardContextType
);

export const useDashboard = () => {
  return useContext(DashboardContext);
};
