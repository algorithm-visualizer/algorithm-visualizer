import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'PLAYER';

const shouldBuild = createAction(`${prefix}/SHOULD_BUILD`, () => ({ buildAt: Date.now() }));
const setChunks = createAction(`${prefix}/SET_CHUNKS`, chunks => ({ chunks }));
const setCursor = createAction(`${prefix}/SET_CURSOR`, cursor => ({ cursor }));
const setLineIndicator = createAction(`${prefix}/SET_LINE_INDICATOR`, lineIndicator => ({ lineIndicator }));

export const actions = {
  shouldBuild,
  setChunks,
  setCursor,
  setLineIndicator,
};

const defaultState = {
  buildAt: 0,
  chunks: [],
  cursor: 0,
  lineIndicator: undefined,
};

export default handleActions({
  [combineActions(
    shouldBuild,
    setChunks,
    setCursor,
    setLineIndicator,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, defaultState);
