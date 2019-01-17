import express from 'express';
import path from 'path';
import uuid from 'uuid';
import fs from 'fs-extra';
import Promise from 'bluebird';

const router = express.Router();

const uploadPath = path.resolve(__dirname, '..', 'public', 'visualizations');
const getVisualizationPath = visualizationId => path.resolve(uploadPath, `${visualizationId}.json`);

fs.remove(uploadPath).catch(console.error);

const uploadVisualization = (req, res, next) => {
  const { content } = req.body;
  const visualizationId = uuid.v4();
  const tracesPath = getVisualizationPath(visualizationId);
  const url = `https://algorithm-visualizer.org/scratch-paper/new?visualizationId=${visualizationId}`;
  fs.outputFile(tracesPath, content)
    .then(() => res.send(url))
    .catch(next);
};

const getVisualization = (req, res, next) => {
  const { visualizationId } = req.params;
  const visualizationPath = getVisualizationPath(visualizationId);
  new Promise((resolve, reject) => {
    res.sendFile(visualizationPath, err => {
      if (err) return reject(new Error('Visualization Expired'));
      resolve();
    });
  }).catch(next)
    .finally(() => fs.remove(visualizationPath));
};

router.route('/')
  .post(uploadVisualization);

router.route('/:visualizationId')
  .get(getVisualization);

export default router;
