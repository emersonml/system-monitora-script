import dynamic from 'next/dynamic';

import { ColumnConfig as ColumnChartConfig, PieConfig as PieChartConfig } from '@ant-design/charts';
import { Skeleton } from 'antd';

const ColumnChart = dynamic<ColumnChartConfig>(() => import('@ant-design/charts').then(mod => mod.Column), {
    ssr: false,
    loading: () => <Skeleton active title={false} paragraph={{ rows: 8 }} />
});

const PieChart = dynamic<PieChartConfig>(() => import('@ant-design/charts').then(mod => mod.Pie), {
    ssr: false,
    loading: () => <Skeleton active title={false} paragraph={{ rows: 8 }} />
});

export { ColumnChart, PieChart };
export type { ColumnChartConfig, PieChartConfig };
