import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ConsumptionData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

const mockConsumptionData: ConsumptionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly Milk Consumption (Litres)',
      data: [25, 28, 30, 32, 35, 33, 38, 40, 37, 39, 42, 45],
      borderColor: '#2ECC71',
      backgroundColor: 'rgba(46, 204, 113, 0.2)',
      tension: 0.4,
    },
  ],
};

const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#1F2933', // Dark text color for legend
      },
    },
    title: {
      display: true,
      text: 'Monthly Milk Consumption',
      color: '#1F2933', // Dark text color for title
      font: {
        size: 18,
        weight: 'bold' as const,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#1F2933', // Dark text color for x-axis labels
      },
      grid: {
        color: 'rgba(0,0,0,0.05)', // Light grid lines
      },
    },
    y: {
      ticks: {
        color: '#1F2933', // Dark text color for y-axis labels
      },
      grid: {
        color: 'rgba(0,0,0,0.05)', // Light grid lines
      },
    },
  },
};

const ConsumptionGraph: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <Line data={mockConsumptionData} options={options} />
    </div>
  );
};

export default ConsumptionGraph;
