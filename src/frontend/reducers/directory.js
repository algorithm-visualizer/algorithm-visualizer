import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'DIRECTORY';

const setCategories = createAction(`${prefix}/SET_CATEGORIES`, categories => ({ categories }));
const setScratchPapers = createAction(`${prefix}/SET_SCRATCH_PAPERS`, scratchPapers => ({ scratchPapers }));
const setCurrent = createAction(`${prefix}/SET_CURRENT`, (categoryKey, algorithmKey, gistId, titles, descFile, codeFiles) => ({
  current: { categoryKey, algorithmKey, gistId, titles, descFile, codeFiles },
}));

export const actions = {
  setCategories,
  setScratchPapers,
  setCurrent,
};

const defaultState = {
  categories: [],
  scratchPapers: [],
  current: {
    categoryKey: null,
    algorithmKey: null,
    gistId: null,
    titles: [],
    descFile: {
      name: null,
      content: null,
      contributors: [],
    },
    codeFiles: [],
  },
};

export default handleActions({
  [combineActions(
    setCategories,
    setScratchPapers,
    setCurrent,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
