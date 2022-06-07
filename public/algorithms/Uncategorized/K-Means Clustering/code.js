// import visualization libraries {
const {
  Array2DTracer,
  Layout,
  LogTracer,
  Tracer,
  VerticalLayout,
  ScatterTracer,
  Randomize,
} = require('algorithm-visualizer')
// }

// define helper functions {
const shuffle = a => {
  const array = a.slice(0)
  const copy = []
  let n = array.length

  while (n) {
    let i = Math.floor(Math.random() * n--)
    copy.push(array.splice(i, 1)[0])
  }

  return copy
}

const sum = (x, y) => x + y
const chooseRandomCenters = (data, k) => shuffle(data).slice(0, k)
const pointify = ([x, y]) => `(${x}, ${y})`
const arrayify = a => a.map(pointify)
const stringify = a => arrayify(a).join(', ')
const distance = ([x1, y1], [x2, y2]) => sum(Math.pow(x1 - x2, 2),
    Math.pow(y1 - y2, 2))
const col = (a, i) => a.map(p => p[i])
const mean = a => a.reduce(sum, 0) / a.length
const centerOfCluster = cluster => [
  mean(col(cluster, 0)),
  mean(col(cluster, 1)),
]
const reCalculateCenters = clusters => clusters.map(centerOfCluster)
const areCentersEqual = (c1, c2) => !!c1 && !!c2 && !(c1 < c2 || c2 < c1)

function cluster(data, centers) {
  const clusters = centers.map(() => [])

  for (let i = 0; i < data.length; i++) {
    const point = data[i]
    let minDistance = Infinity
    let minDistanceIndex = -1

    for (let j = 0; j < centers.length; j++) {
      const d = distance(point, centers[j])

      if (d < minDistance) {
        minDistance = d
        minDistanceIndex = j
      }
    }

    if (!clusters[minDistanceIndex] instanceof Array) {
      clusters[minDistanceIndex] = []
    }

    clusters[minDistanceIndex].push(point)
  }

  return clusters
}

// }

// define tracer variables {
const array2dTracer = new Array2DTracer('Grid')
const logTracer = new LogTracer('Console')
const scatterTracer = new ScatterTracer('Scatter')
// }

// define input variables
const unClusteredData = Randomize.Array2D(
    { N: Randomize.Integer({ min: 10, max: 25 }) })
const k = Randomize.Integer(
    { min: 2, max: Math.floor(unClusteredData.length / 5) })

const recenterAndCluster = (originalClusters) => {
  const centers = reCalculateCenters(originalClusters)
  const clusters = cluster(unClusteredData, centers)
  return { centers, clusters }
}

const improve = (loops, clusters, centers) => {
  const allowImprove = () => loops < 1000

  if (!allowImprove()) {
    return { clusters, centers }
  }

  loops++

  const ret = recenterAndCluster(clusters)

  // trace {
  array2dTracer.set(clusters.map(c => c.map(pointify)))
  scatterTracer.set([unClusteredData, ...ret.clusters, ret.centers])

  logTracer.println('')
  logTracer.println(`Iteration #${loops} Result: `)
  logTracer.println(`\tClusters:`)
  logTracer.println(
      `\t\t${ret.clusters.map(c => stringify(c)).join(`\n\t\t`)}`)
  logTracer.println(`\tCenters:`)
  logTracer.println(`\t\t${stringify(ret.centers)}`)
  logTracer.println('')

  Tracer.delay()
  // }

  if (!allowImprove() || areCentersEqual(centers, ret.centers)) {
    return ret
  }

  return improve(loops, ret.clusters, ret.centers)
}

(function main() {
  // visualize {
  Layout.setRoot(new VerticalLayout([scatterTracer, array2dTracer, logTracer]))

  logTracer.println(`Un-clustered data = ${stringify(unClusteredData)}`)
  array2dTracer.set([unClusteredData.map(pointify)])
  scatterTracer.set([unClusteredData])

  Tracer.delay()
  // }

  // Start with random centers
  const centers = chooseRandomCenters(unClusteredData, k)

  // trace {
  logTracer.println(
      `Initial random selected centers = ${stringify(centers)}`)
  scatterTracer.set([unClusteredData, ...[[], []], centers])

  Tracer.delay()
  // }

  // Cluster to the random centers
  const clusters = cluster(unClusteredData, centers)

  // trace {
  logTracer.println(
      `Initial clusters = \n\t${clusters.map(stringify).join('\n\t')}`)
  array2dTracer.set(clusters.map(c => c.map(pointify)))
  scatterTracer.set([unClusteredData, ...clusters, centers])

  Tracer.delay()
  // }

  // start iterations here
  const ret = improve(0, clusters, centers)

  // trace {
  Tracer.delay()

  logTracer.println(
      `Final clustered data = \n\t${ret.clusters.map(stringify)
          .join('\n\t')}`)
  logTracer.println(`Best centers = ${stringify(ret.centers)}`)
  array2dTracer.set(ret.clusters.map(c => c.map(pointify)))
  scatterTracer.set([unClusteredData, ...ret.clusters, ret.centers])
  Tracer.delay()
  // }
})()
