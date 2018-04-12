import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'ENV';

const setCategories = createAction(`${prefix}/SET_CATEGORIES`, categories => ({ categories }));
const selectAlgorithm = createAction(`${prefix}/SELECT_ALGORITHM`, (categoryKey, algorithmKey) => ({
  categoryKey,
  algorithmKey,
  fileKey: null,
}));
const setAlgorithm = createAction(`${prefix}/SET_ALGORITHM`, algorithm => ({ algorithm }));
const selectFile = createAction(`${prefix}/SELECT_FILE`, (categoryKey, algorithmKey, fileKey) => ({
  categoryKey,
  algorithmKey,
  fileKey,
}));

export const actions = {
  setCategories,
  selectAlgorithm,
  setAlgorithm,
  selectFile,
};

const immutables = {};

const mutables = {
  categories: null,
  categoryKey: null,
  algorithmKey: null,
  fileKey: null,
  algorithm: null,
};

export default handleActions({
  [combineActions(
    setCategories,
    selectAlgorithm,
    setAlgorithm,
    selectFile,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, {
  ...immutables,
  ...mutables,
});
