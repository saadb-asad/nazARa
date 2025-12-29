'use client'

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface AnalyticsChartProps {
    data: {
        name: string
        total: number
    }[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
    const chartData = {
        labels: data.map(d => d.name),
        datasets: [
            {
                label: 'Scans',
                data: data.map(d => d.total),
                backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red-500 equivalent
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    precision: 0
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        },
    };

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <Bar options={options} data={chartData} />
        </div>
    );
}
