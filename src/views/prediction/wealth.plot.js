import {Line} from "react-chartjs-2";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
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
  // scales: {
  //   y2: {
  //     position: 'right',
  //     grid: {
  //       drawOnChartArea: false,
  //     },
  //   },
  // },
};

export default function WealthPlot({data: list}) {

  // get data
  const {prediction, history} = list;

  // get data as array
  let predSum = prediction.map(b => ({x: b.year, y: b.sum}));
  let predSav = prediction.map(b => ({x: b.year, y: b.savingsSumPlot}));

  // check for historical data
  if(history.length > 0) {

    // get data
    const lastH = history[history.length - 1];
    predSum = [{x: lastH.year, y: lastH.sum}, ...predSum];
    predSav = [{x: lastH.year, y: lastH.sum}, ...predSav];

  }

  const data = {
    labels: [...history.map(b => b.year), ...prediction.map(b => b.year)],
    datasets: [
      {
        type: 'line',
        label: 'History',
        data: history.map(b => ({x: b.year, y: b.sum})),
        borderColor: '#82929a',
        backgroundColor: '#e4ecf6',
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: 'Wealth',
        data: predSum,
        borderColor: '#497d93',
        backgroundColor: '#e4ecf6',
        yAxisID: 'y1',
        pointRadius: 0,
      },
      {
        type: 'line',
        label: 'Investment',
        data: predSav,
        borderColor: '#d59973',
        backgroundColor: '#f5ece7',
        yAxisID: 'y1',
        pointRadius: 0,
      },
    ],
  };

  return (
      <div style={{height: "20em"}}>
        <Line options={options} data={data} type='line' />
      </div>
    )


}
