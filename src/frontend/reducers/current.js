import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'CURRENT';

const setCurrent = createAction(`${prefix}/SET_CURRENT`, (categoryKey, algorithmKey, gistId, titles, files) => ({
  categoryKey, algorithmKey, gistId, titles, files, lastTitles: titles, lastFiles: files,
}));
const renameScratchPaper = createAction(`${prefix}/RENAME_SCRATCH_PAPER`, title => ({ titles: ['Scratch Paper', title] }));
const addFile = createAction(`${prefix}/ADD_FILE`, file => ({ file }));
const modifyFile = createAction(`${prefix}/MODIFY_FILE`, file => ({ file }));
const deleteFile = createAction(`${prefix}/DELETE_FILE`, index => ({ index }));
const renameFile = createAction(`${prefix}/RENAME_FILE`, (index, name) => ({ index, name }));

export const actions = {
  setCurrent,
  renameScratchPaper,
  addFile,
  modifyFile,
  deleteFile,
  renameFile,
};

const defaultState = {
  categoryKey: undefined,
  algorithmKey: undefined,
  gistId: undefined,
  titles: [],
  files: [],
  lastTitles: [],
  lastFiles: [],
};

const getNextState = (state, files) => ({
  ...state,
  ...(state.gistId ? {} : {
    categoryKey: undefined,
    algorithmKey: undefined,
    gistId: 'new',
    titles: ['Scratch Paper', 'Untitled'],
    lastTitles: [],
    lastFiles: [],
  }),
  files: files.map(file => ({ ...file, contributors: undefined })),
});

export default handleActions({
  [combineActions(
    setCurrent,
    renameScratchPaper,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [addFile]: (state, { payload }) => {
    const { file } = payload;
    const files = [...state.files, file];
    return getNextState(state, files);
  },
  [modifyFile]: (state, { payload }) => {
    const { file } = payload;
    const files = state.files.map(oldFile => oldFile.name === file.name ? file : oldFile);
    return getNextState(state, files);
  },
  [deleteFile]: (state, { payload }) => {
    const { index } = payload;
    const files = state.files.filter((file, i) => i !== index);
    return getNextState(state, files);
  },
  [renameFile]: (state, { payload }) => {
    const { index, name } = payload;
    const files = state.files.map((file, i) => i === index ? { ...file, name } : file);
    return getNextState(state, files);
  },
}, defaultState);
