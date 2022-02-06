import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Chart, Bar } from 'react-chartjs-2';

import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: false,
    },
  },
  scales: {
    y2: {
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

export default function BalancePlot({periods}) {

  const data = {
    labels: periods.map(b => moment(b.date.end).format('ll')),
    datasets: [
      {
        type: 'line',
        label: 'Balance',
        data: periods.map(b => b.amount),
        borderColor: '#497d93',
        backgroundColor: '#e4ecf6',
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  // show invests (if any)
  const invests = periods.map(b => b.cumSum);
  if(invests.filter(i => i > 0).length > 0) {
    data.datasets.push({
      type: 'line',
      label: 'Investment',
      data: invests,
      borderColor: '#d59973',
      backgroundColor: '#f5ece7',
      borderWidth: 2,
      yAxisID: 'y1',
    });
  }

  // show orders (if any)
  const orders = periods.map(b => b.sum);
  if(orders.filter(i => i > 0).length > 0) {
    data.datasets.push({
      label: 'Orders',
      backgroundColor: '#cbdce3',
      data: orders,
      borderColor: '#ffffff',
      borderWidth: 2,
      yAxisID: 'y2',
    },)
  }

  return <Bar options={options} data={data} type='bar' />;

}
