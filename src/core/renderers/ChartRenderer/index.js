import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Array1DRenderer } from 'core/renderers';
import styles from './ChartRenderer.module.scss';

class ChartRenderer extends Array1DRenderer {
  renderData() {
    const { data: [row] } = this.props.data;

    const chartData = {
      labels: row.map(col => `${col.value}`),
      datasets: [{
        backgroundColor: row.map(col => col.patched ? styles.colorPatched : col.selected ? styles.colorSelected : styles.colorFont),
        data: row.map(col => col.value),
      }],
    };
    return (
      <Bar data={chartData} options={{
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        animation: false,
        legend: false,
        responsive: true,
        maintainAspectRatio: false
      }} />
    );
  }
}

export default ChartRenderer;

