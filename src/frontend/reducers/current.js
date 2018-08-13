import { combineActions, createAction, handleActions } from 'redux-actions';
import Cookies from 'js-cookie';

const prefix = 'CURRENT';

const setHome = createAction(`${prefix}/SET_HOME`, () => ({ algorithm: undefined, scratchPaper: undefined }));
const setAlgorithm = createAction(`${prefix}/SET_ALGORITHM`, ({ categoryKey, categoryName, algorithmKey, algorithmName, files }) => ({
  algorithm: { categoryKey, categoryName, algorithmKey, algorithmName, files },
  scratchPaper: undefined,
}));
const setScratchPaper = createAction(`${prefix}/SET_SCRATCH_PAPER`, ({ gistId, title, files, gist }) => ({
  algorithm: undefined,
  scratchPaper: { gistId, title, files, lastTitle: title, lastFiles: files, lastGist: gist },
}));
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

const defaultState = {
  algorithm: undefined,
  scratchPaper: undefined,
};

const getScratchPaper = state => {
  const { algorithm, scratchPaper } = state;
  if (algorithm) {
    return {
      gistId: 'new',
      title: 'Untitled',
      files: algorithm.files,
      lastTitle: '',
      lastFiles: [],
      gist: undefined,
    };
  } else if (scratchPaper) {
    if (['new', 'forked'].includes(scratchPaper.gistId)) {
      return scratchPaper;
    } else if (Cookies.get('login') !== scratchPaper.lastGist.owner.login) {
      return {
        ...scratchPaper,
        gistId: 'forked',
        lastTitle: '',
        lastFiles: [],
      };
    }
  }
  return scratchPaper;
};

const updateScratchPaper = (state, scratchPaper, update) => ({
  ...state,
  algorithm: undefined,
  scratchPaper: { ...scratchPaper, ...update },
});

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
    const scratchPaper = getScratchPaper(state);
    return updateScratchPaper(state, scratchPaper, { title });
  },
  [addFile]: (state, { payload }) => {
    const { file } = payload;
    const scratchPaper = getScratchPaper(state);
    const files = [...scratchPaper.files, file];
    return updateScratchPaper(state, scratchPaper, { files });
  },
  [modifyFile]: (state, { payload }) => {
    const { file } = payload;
    const scratchPaper = getScratchPaper(state);
    const files = scratchPaper.files.map(oldFile => oldFile.name === file.name ? file : oldFile);
    return updateScratchPaper(state, scratchPaper, { files });
  },
  [deleteFile]: (state, { payload }) => {
    const { index } = payload;
    const scratchPaper = getScratchPaper(state);
    const files = scratchPaper.files.filter((file, i) => i !== index);
    return updateScratchPaper(state, scratchPaper, { files });
  },
  [renameFile]: (state, { payload }) => {
    const { index, name } = payload;
    const scratchPaper = getScratchPaper(state);
    const files = scratchPaper.files.map((file, i) => i === index ? { ...file, name } : file);
    return updateScratchPaper(state, scratchPaper, { files });
  },
}, defaultState);
