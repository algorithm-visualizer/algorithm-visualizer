import Cookies from 'js-cookie';
import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'ENV';

const setExt = createAction(`${prefix}/SET_EXT`, ext => {
  Cookies.set('ext', ext);
  return { ext };
});

export const actions = {
  setExt,
};

const accessToken = Cookies.get('access_token');
const ext = Cookies.get('ext');
const defaultState = {
  accessToken,
  signedIn: !!accessToken,
  ext,
};

export default handleActions({
  [combineActions(
    setExt,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
