type ServiceStatus =
  | 'OPERATIONAL'
  | 'DEGRADED'
  | 'PARTIAL_OUTAGE'
  | 'MAJOR_OUTAGE';

interface Service {
  id: number;
  name: string;
  status: ServiceStatus;
  oneOpenIncidentOnly: boolean;
  showUptimeHistory: boolean;
  teams: any;
}

interface AffectedService {
  service: Service;
  impact: ServiceStatus;
}

interface Incident {
  id: number;
  summary: string;
  status: 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
  message: string;
  sendNotification: boolean;
  createdAt: string;
  updatedAt: string;
  affectedServices: AffectedService[];
  createdBy: number;
  updatedByUser: number;
  lastHistory: string;
  lastHistoryCreatedAt: string;
  lastHistoryUpdatedAt: string;
}

type Incidents = Incident[];
