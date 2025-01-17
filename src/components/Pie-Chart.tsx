'use client'

import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
 data: { category: string, amount: number}[]
}

export function PieChart({ data }: PieChartProps) {
 const chartData = {
  labels: data.map((item) => item.category),
  datasets: [
   {
    label: 'Transações por categoria',
    data: data.map((item) => item.amount),
    backgroundColor: [
     'rgba(255, 99, 132, 0.2)',
     'rgba(54, 162, 235, 0.2)',
     'rgba(255, 206, 86, 0.2)',
     'rgba(75, 192, 192, 0.2)',
     'rgba(153, 102, 255, 0.2)',
    ],
    borderColor: [
     'rgba(255, 99, 132, 1)',
     'rgba(54, 162, 235, 1)',
     'rgba(255, 206, 86, 1)',
     'rgba(75, 192, 192, 1)',
     'rgba(153, 102, 255, 1)',
   ],
   borderWidth: 1,
   },
  ],
 }

 const options = {
  responsive: true,
  plugins: {
   title: {
    display: true,
    text: 'Distribuição de Transações por categoria',
   },
  },
 }

 return <Pie data={chartData} options={options} />
}