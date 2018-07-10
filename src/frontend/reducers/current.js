import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'CURRENT';

const setCurrent = createAction(`${prefix}/SET_CURRENT`, (categoryKey, algorithmKey, gistId, titles, files) => ({
  categoryKey, algorithmKey, gistId, titles, files, saved: true,
}));
const saveScratchPaper = createAction(`${prefix}/SAVE_SCRATCH_PAPER`, gistId => ({ gistId, saved: true }));
const renameScratchPaper = createAction(`${prefix}/RENAME_SCRATCH_PAPER`, title => ({
  titles: ['Scratch Paper', title],
  saved: false,
}));
const addFile = createAction(`${prefix}/ADD_FILE`, file => ({ file }));
const modifyFile = createAction(`${prefix}/MODIFY_FILE`, file => ({ file }));
const deleteFile = createAction(`${prefix}/DELETE_FILE`, file => ({ file }));
// TODO: 파일 추가/삭제

export const actions = {
  setCurrent,
  saveScratchPaper,
  renameScratchPaper,
  addFile,
  modifyFile,
  deleteFile,
};

const defaultState = {
  categoryKey: undefined,
  algorithmKey: undefined,
  gistId: undefined,
  titles: [],
  files: [],
  saved: true,
};

const getNextState = (state, files) => ({
  ...state,
  ...(state.gistId ? {} : {
    categoryKey: undefined,
    algorithmKey: undefined,
    gistId: 'new',
    titles: ['Scratch Paper', 'Untitled'],
  }),
  files,
  saved: false,
});

export default handleActions({
  [combineActions(
    setCurrent,
    saveScratchPaper,
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
    const { file } = payload;
    const files = state.files.filter(oldFile => oldFile.name !== file.name);
    return getNextState(state, files);
  },
}, defaultState);
