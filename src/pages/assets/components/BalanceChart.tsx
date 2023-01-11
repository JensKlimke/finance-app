import Chart from "react-apexcharts";
import {PeriodType} from "../hooks/periods";
import {useMemo} from "react";
import {ApexOptions} from "apexcharts";

const options : ApexOptions = {
  chart: {
    foreColor: '#ffffff',
    animations: {
      enabled: false
    },
  },
  stroke: {
    width: 3,
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

export default function BalanceChart ({periods} : {periods: PeriodType[]}) {
  const data = useMemo(() => {
    const per = [...periods].slice(1);
    return [
      {
        name: 'Balance',
        data: per.map(p => ({x: p.date.end, y: p.amount})),
        type: 'line',
      },
      {
        name: 'Invest',
        data: per.map(p => ({x: p.date.end, y: p.invest})),
        type: 'line',
      },
    ];
  }, [periods]);
  return (
    <Chart
      options={options}
      series={data}
      type="line"
    />
  );
}
