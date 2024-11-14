interface UptimePercentage {
  p90: number;
  p60: number;
  p30: number;
}

interface Outage {
  status: ServiceStatus;
  from: string;
  until: string;
  ongoing?: boolean;
}

interface ServiceUptime {
  uptimePercentage: UptimePercentage;
  rangeStart: string;
  rangeEnd: string;
  outages: Outage[];
}

interface Service {
  id: number;
  name: string;
  status: ServiceStatus;
  oneOpenIncidentOnly: boolean;
  showUptimeHistory: boolean;
  teams: any;
  uptime: ServiceUptime;
}

type Services = Service[];
