import { combineActions, createAction, handleActions } from 'redux-actions';

const prefix = 'TRACER';

const setData = createAction(`${prefix}/SET_DATA`, data => ({ data }));
const setCode = createAction(`${prefix}/SET_CODE`, code => ({ code }));

export const actions = {
  setData,
  setCode,
};

const immutables = {};

const mutables = {
  data: '',
  code: '',
};

export default handleActions({
  [combineActions(
    setData,
    setCode,
  )]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, {
  ...immutables,
  ...mutables,
});
