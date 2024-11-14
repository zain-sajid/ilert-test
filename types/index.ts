type TeamContext = {
  value: number;
  title: string;
};

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AlertActivityFilter = {
  alertUpdates: boolean;
  callRoutingEvents: boolean;
  connectorEvents: boolean;
  alertSourceEvents: boolean;
  notifications: boolean;
  incidentCommunications: boolean;
};

type WidgetMeta = {
  id: string;
  teamContext?: TeamContext;
  metricTimeRange?: string;
  settingsType?: string;
  position: Position;
  alertActivityFilter?: AlertActivityFilter;
  onCallLevel?: number;
  selectedEntities?: any[];
};

type Widget = {
  name: string;
  type: string;
  meta: WidgetMeta;
};

export type LayoutConfig = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}[];

export type Dashboard = {
  id: number;
  name: string;
  widgets: Widget[];
  accessType: 'PRIVATE' | 'PUBLIC';
  shareKey: string;
  ownerId: number;
};
