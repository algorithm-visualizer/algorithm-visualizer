import Cookies from 'js-cookie';
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

const accessToken = Cookies.get('access_token');
const defaultState = {
  categories: null,
  categoryKey: null,
  algorithmKey: null,
  accessToken,
  signedIn: !!accessToken,
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
