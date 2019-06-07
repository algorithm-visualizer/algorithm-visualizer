import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'PLAYER';

const setChunks = createAction(`${prefix}/SET_CHUNKS`, chunks => ({ chunks }));
const setCursor = createAction(`${prefix}/SET_CURSOR`, cursor => ({ cursor }));
const setLineIndicator = createAction(`${prefix}/SET_LINE_INDICATOR`, lineIndicator => ({ lineIndicator }));

export const actions = {
  setChunks,
  setCursor,
  setLineIndicator,
};

const defaultState = {
  chunks: [],
  cursor: 0,
  lineIndicator: undefined,
};

export default handleActions({
  [combineActions(
    setChunks,
    setCursor,
    setLineIndicator,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
