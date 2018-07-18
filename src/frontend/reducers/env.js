import Cookies from 'js-cookie';
import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'ENV';

const setExt = createAction(`${prefix}/SET_EXT`, ext => {
  Cookies.set('ext', ext);
  return { ext };
});
const setUser = createAction(`${prefix}/SET_USER`, user => ({ user }));

export const actions = {
  setExt,
  setUser,
};

const defaultState = {
  ext: Cookies.get('ext') || 'js',
  user: undefined,
};

export default handleActions({
  [combineActions(
    setExt,
    setUser,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
