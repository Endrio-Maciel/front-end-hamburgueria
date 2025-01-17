'use client'

import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
 data: {title: string, amount: number}[]
}

export function BarChart ({ data }: BarChartProps) {
 const chartData = {
  labels: data.map((item) => item.title),
  datasets: [
   {
    label: 'Valor das transações',
    data: data.map(((item) => item.amount)),
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
   },
  ],
 }
 
 const options = {
  responsive: true,
  plugins: {
   title: {
    display: true,
    text: 'Gráfico de Transações'
   },
  },
 }

 return <Bar data={chartData} options={options} />
}