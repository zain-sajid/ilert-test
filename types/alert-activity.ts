interface AlertSource {
  name: string;
  iconUrl: string;
}

interface Alert {
  summary: string;
  alertSource: AlertSource;
}

interface AlertActivity {
  id: number;
  timestamp: string;
  text: string;
  alert: Alert;
}

type AlertActivityResponse = AlertActivity[];
