type Metric = {
  id: number;
  name: string;
  description: string;
  unitLabel: string;
  displayType: 'GRAPH' | 'SINGLE';
  aggregationType: 'AVG' | 'SUM' | 'MIN' | 'MAX' | 'LAST';
  interpolateGaps: boolean;
  showValuesOnMouseOver: boolean;
  mouseOverDecimal: number;
  lockYAxisMin: number;
  lockYAxisMax: number;
  teams: {
    id: number;
    name: string;
  }[];
};

type Metrics = Metric[];
