import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'ENV';

const setCategories = createAction(`${prefix}/SET_CATEGORIES`, categories => ({ categories }));
const setDirectory = createAction(`${prefix}/SET_DIRECTORY`, (categoryKey, algorithmKey) => ({
  categoryKey,
  algorithmKey,
}));

export const actions = {
  setCategories,
  setDirectory,
};

const defaultState = {
  categories: null,
  categoryKey: null,
  algorithmKey: null,
};

export default handleActions({
  [combineActions(
    setCategories,
    setDirectory,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
