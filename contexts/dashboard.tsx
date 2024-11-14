import { createContext } from 'react';

type DashboardContextType = {
  selectedDashboard: any;
  layoutConfig: any;
  mutate: any;
  isEditing: boolean;
  addWidgetToDashboard: (type: string) => void;
};

export const DashboardContext = createContext<DashboardContextType>(
  {} as DashboardContextType
);
