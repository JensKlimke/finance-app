import Chart from "react-apexcharts";
import {PeriodType} from "../hooks/periods";
import {useMemo} from "react";

const options = {
  chart: {
    foreColor: '#ffffff',
    animations: {
      enabled: false
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: [{
    title: {
      text: 'Amount',
    },
    labels: {
      formatter: function (v : number) {
        return '€' + (v / 1000).toFixed(1) + 'k'
      }
    },
  }]
};

export default function OrdersChart ({periods} : {periods: PeriodType[]}) {
  const data = useMemo(() => {
    const per = [...periods].slice(1);
    return [
      {
        name: 'Orders',
        data: per.map(p => ({x: p.date.end, y: p.sum})),
      }
    ];
  }, [periods]);
  return (
    <Chart
  // @ts-ignore
      options={options}
      series={data}
      type="bar"
    />
  );
}
