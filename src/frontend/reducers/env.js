import Cookies from 'js-cookie';
import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'ENV';

const setHierarchy = createAction(`${prefix}/SET_HIERARCHY`, hierarchy => ({ hierarchy }));
const setDirectory = createAction(`${prefix}/SET_DIRECTORY`, (categoryKey, algorithmKey) => ({
  categoryKey,
  algorithmKey,
}));

export const actions = {
  setHierarchy,
  setDirectory,
};

const accessToken = Cookies.get('access_token');
const defaultState = {
  hierarchy: null,
  categoryKey: null,
  algorithmKey: null,
  accessToken,
  signedIn: !!accessToken,
};

export default handleActions({
  [combineActions(
    setHierarchy,
    setDirectory,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
