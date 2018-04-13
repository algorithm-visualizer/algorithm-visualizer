import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'ENV';

const setCategories = createAction(`${prefix}/SET_CATEGORIES`, categories => ({ categories }));
const setDirectory = createAction(`${prefix}/SELECT_FILE`, (categoryKey, algorithmKey, fileKey) => ({
  categoryKey,
  algorithmKey,
  fileKey,
}));

export const actions = {
  setCategories,
  setDirectory,
};

const immutables = {};

const mutables = {
  categories: null,
  categoryKey: null,
  algorithmKey: null,
  fileKey: null,
};

export default handleActions({
  [combineActions(
    setCategories,
    setDirectory,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, {
  ...immutables,
  ...mutables,
});
