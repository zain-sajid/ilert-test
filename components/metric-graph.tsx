import { fetcherWithAuthHeader } from '@/lib/fetcher';
import moment from 'moment';
import {
  XAxis,
  Area,
  AreaChart,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
  TooltipProps
} from 'recharts';
import useSWR from 'swr';

export default function MetricGraph({ metric }: { metric: Metric }) {
  const from = moment().subtract(30, 'day').unix();
  const until = moment().unix();

  const { data, isLoading } = useSWR(
    `api/metrics/${metric.id}/series?aggregation=${metric.aggregationType}&interval-sec=7200&from=${from}&until=${until}&interpolate=true`,
    fetcherWithAuthHeader
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-1 flex justify-between">
        <h3 className="text-sm font-medium">{metric.name}</h3>
        <h4 className="text-sm font-medium text-neutral-500">
          {metric.aggregationType} - {data?.totalAgg?.toFixed(2)} ms
        </h4>
      </div>
      <ResponsiveContainer width="100%" height={175}>
        <AreaChart
          data={data.series.map((v: number[]) => {
            return {
              timestamp: v[0],
              series: v[1]
            };
          })}
          width={1200}
          height={300}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="series"
            stroke="#409ee7"
            fill="#c8e3f8"
          />
          <XAxis
            dataKey="timestamp"
            interval="preserveStart"
            tick={{ fontSize: 12 }}
            tickFormatter={(unixTime) => moment.unix(unixTime).format('DD MMM')}
            minTickGap={40}
          />
          <YAxis
            orientation="right"
            interval="preserveEnd"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={CustomTooltip} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-white p-2 text-sm shadow-md">
        <p className="text-neutral-700">
          {moment.unix(label).format('DD MMM, HH:mm')} -{' '}
          <span className="font-semibold">
            {payload[0].value?.toFixed(2)} ms
          </span>
        </p>
      </div>
    );
  }

  return null;
};
