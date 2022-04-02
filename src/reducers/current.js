import { combineActions, createAction, handleActions } from 'redux-actions';
import { ROOT_README_MD } from 'files';
import { extension, isSaved } from 'common/util';

const prefix = 'CURRENT';

const setHome = createAction(`${prefix}/SET_HOME`, () => defaultState);
const setAlgorithm = createAction(`${prefix}/SET_ALGORITHM`, ({ categoryKey, categoryName, algorithmKey, algorithmName, files, description }) => ({
  algorithm: { categoryKey, algorithmKey },
  titles: [categoryName, algorithmName],
  files,
  description,
}));
const setScratchPaper = createAction(`${prefix}/SET_SCRATCH_PAPER`, ({ login, gistId, title, files }) => ({
  scratchPaper: { login, gistId },
  titles: ['Scratch Paper', title],
  files,
  description: homeDescription,
}));
const setEditingFile = createAction(`${prefix}/SET_EDITING_FILE`, file => ({ file }));
const modifyTitle = createAction(`${prefix}/MODIFY_TITLE`, title => ({ title }));
const addFile = createAction(`${prefix}/ADD_FILE`, file => ({ file }));
const renameFile = createAction(`${prefix}/RENAME_FILE`, (file, name) => ({ file, name }));
const modifyFile = createAction(`${prefix}/MODIFY_FILE`, (file, content) => ({ file, content }));
const deleteFile = createAction(`${prefix}/DELETE_FILE`, file => ({ file }));

export const actions = {
  setHome,
  setAlgorithm,
  setScratchPaper,
  setEditingFile,
  modifyTitle,
  addFile,
  modifyFile,
  deleteFile,
  renameFile,
};

const homeTitles = ['Algorithm Visualizer'];
const homeFiles = [ROOT_README_MD];
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
  editingFile: undefined,
  shouldBuild: true,
  saved: true,
};

export default handleActions({
  [combineActions(
    setHome,
    setAlgorithm,
    setScratchPaper,
  )]: (state, { payload }) => {
    const { algorithm, scratchPaper, titles, files, description } = payload;
    return {
      ...state,
      algorithm,
      scratchPaper,
      titles,
      files,
      lastTitles: titles,
      lastFiles: files,
      description,
      editingFile: undefined,
      shouldBuild: true,
      saved: true,
    };
  },
  [setEditingFile]: (state, { payload }) => {
    const { file } = payload;
    return {
      ...state,
      editingFile: file,
      shouldBuild: true,
    };
  },
  [modifyTitle]: (state, { payload }) => {
    const { title } = payload;
    const newState = {
      ...state,
      titles: [state.titles[0], title],
    };
    return {
      ...newState,
      saved: isSaved(newState),
    };
  },
  [addFile]: (state, { payload }) => {
    const { file } = payload;
    const newState = {
      ...state,
      files: [...state.files, file],
      editingFile: file,
      shouldBuild: true,
    };
    return {
      ...newState,
      saved: isSaved(newState),
    };
  },
  [combineActions(
    renameFile,
    modifyFile,
  )]: (state, { payload }) => {
    const { file, ...update } = payload;
    const editingFile = { ...file, ...update };
    const newState = {
      ...state,
      files: state.files.map(oldFile => oldFile === file ? editingFile : oldFile),
      editingFile,
      shouldBuild: extension(editingFile.name) === 'md',
    };
    return {
      ...newState,
      saved: isSaved(newState),
    };
  },
  [deleteFile]: (state, { payload }) => {
    const { file } = payload;
    const index = state.files.indexOf(file);
    const files = state.files.filter(oldFile => oldFile !== file);
    const editingFile = files[Math.min(index, files.length - 1)];
    const newState = {
      ...state,
      files,
      editingFile,
      shouldBuild: true,
    };
    return {
      ...newState,
      saved: isSaved(newState),
    };
  },
}, defaultState);
