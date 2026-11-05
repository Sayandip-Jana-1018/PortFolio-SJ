import {
  Chart as ChartJS,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import type { ChartData, ChartOptions, ChartType } from 'chart.js';

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  Title,
  Tooltip
);

export interface ChartCanvasProps {
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
}

/** Everything that needs chart.js lives here, so it can load in its own chunk. */
const ChartCanvas = ({ type, data, options }: ChartCanvasProps) => (
  <Chart type={type} data={data} options={options} />
);

export default ChartCanvas;
