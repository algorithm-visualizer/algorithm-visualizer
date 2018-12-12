import { combineActions, createAction, handleActions } from 'redux-actions';
import { README_MD } from '/files';

const prefix = 'CURRENT';

const setHome = createAction(`${prefix}/SET_HOME`, () => defaultState);
const setAlgorithm = createAction(`${prefix}/SET_ALGORITHM`, ({ categoryKey, categoryName, algorithmKey, algorithmName, files, description }) => {
  const titles = [categoryName, algorithmName];
  return {
    algorithm: { categoryKey, algorithmKey },
    scratchPaper: undefined,
    titles,
    files,
    lastTitles: titles,
    lastFiles: files,
    description,
  };
});
const setScratchPaper = createAction(`${prefix}/SET_SCRATCH_PAPER`, ({ login, gistId, title, files }) => {
  const titles = ['Scratch Paper', title];
  return {
    algorithm: undefined,
    scratchPaper: { login, gistId },
    titles,
    files,
    lastTitles: titles,
    lastFiles: files,
    description: homeDescription,
  };
});
const modifyTitle = createAction(`${prefix}/MODIFY_TITLE`, title => ({ title }));
const addFile = createAction(`${prefix}/ADD_FILE`, file => ({ file }));
const modifyFile = createAction(`${prefix}/MODIFY_FILE`, file => ({ file }));
const deleteFile = createAction(`${prefix}/DELETE_FILE`, index => ({ index }));
const renameFile = createAction(`${prefix}/RENAME_FILE`, (index, name) => ({ index, name }));

export const actions = {
  setHome,
  setAlgorithm,
  setScratchPaper,
  modifyTitle,
  addFile,
  modifyFile,
  deleteFile,
  renameFile,
};

const homeTitles = ['Algorithm Visualizer'];
const homeFiles = [README_MD];
const homeDescription = 'Algorithm Visualizer is an interactive online platform that visualizes algorithms from code.';
const defaultState = {
  algorithm: {
    categoryKey: 'algorithm-visualizer',
    algorithmKey: 'home',
  },
  scratchPaper: undefined,
  titles: homeTitles,
  files: homeFiles,
  lastTitles: homeTitles,
  lastFiles: homeFiles,
  description: homeDescription,
};

export default handleActions({
  [combineActions(
    setHome,
    setAlgorithm,
    setScratchPaper,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [modifyTitle]: (state, { payload }) => {
    const { title } = payload;
    return {
      ...state,
      titles: [state.titles[0], title],
    };
  },
  [addFile]: (state, { payload }) => {
    const { file } = payload;
    const files = [...state.files, file];
    return { ...state, files };
  },
  [modifyFile]: (state, { payload }) => {
    const { file } = payload;
    const files = state.files.map(oldFile => oldFile.name === file.name ? file : oldFile);
    return { ...state, files };
  },
  [deleteFile]: (state, { payload }) => {
    const { index } = payload;
    const files = state.files.filter((file, i) => i !== index);
    return { ...state, files };
  },
  [renameFile]: (state, { payload }) => {
    const { index, name } = payload;
    const files = state.files.map((file, i) => i === index ? { ...file, name } : file);
    return { ...state, files };
  },
}, defaultState);
