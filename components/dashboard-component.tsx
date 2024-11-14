import Metrics from '@/components/metrics';
import Services from '@/components/services';
import OpenAlerts from '@/components/open-alerts';
import AddComponent from '@/components/add-component';
import OpenIncidents from '@/components/open-incidents';
import RecentAlertActivity from '@/components/recent-alert-activity';

export default function DashboardComponent({ type }: { type: string }) {
  switch (type) {
    case 'OPEN_ALERTS':
      return <OpenAlerts />;
    case 'ALERT_ACTIVITY':
      return <RecentAlertActivity />;
    case 'METRICS':
      return <Metrics />;
    case 'SERVICES':
      return <Services />;
    case 'OPEN_INCIDENTS':
      return <OpenIncidents />;
    case 'ADD_COMPONENT':
      return <AddComponent />;
    default:
      return <div>Unknown widget type</div>;
  }
}
