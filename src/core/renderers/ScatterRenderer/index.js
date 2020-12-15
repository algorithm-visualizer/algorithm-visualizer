import React from 'react'
import {Scatter} from 'react-chartjs-2'
import Array2DRenderer from '../Array2DRenderer'

const convertToObjectArray = ([x, y]) => ({ x, y })
const colors = ['white', 'green', 'blue', 'red', 'yellow', 'cyan']

class ScatterRenderer extends Array2DRenderer {
  renderData() {
    const { data } = this.props.data

    const datasets = data.map((series, index) => (
        {
          backgroundColor: colors[index],
          data: series.map(s => convertToObjectArray(s.value)),
          label: Math.random(),
          radius: (index + 1) * 2,
        }))

    const chartData = {
      datasets,
    }

    return <Scatter data={chartData} options={{
      legend: false,
      animation: false,
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          }],
        xAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          }],
      },
    }}/>
  }
}

export default ScatterRenderer
