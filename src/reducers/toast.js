import { combineActions, createAction, handleActions } from 'redux-actions';
import uuid from 'uuid';

const prefix = 'TOAST';

const showSuccessToast = createAction(`${prefix}/SHOW_SUCCESS_TOAST`, message => ({ type: 'success', message }));
const showErrorToast = createAction(`${prefix}/SHOW_ERROR_TOAST`, message => ({ type: 'error', message }));
const hideToast = createAction(`${prefix}/HIDE_TOAST`, id => ({ id }));

export const actions = {
  showSuccessToast,
  showErrorToast,
  hideToast,
};

const defaultState = {
  toasts: [],
};

export default handleActions({
  [combineActions(
    showSuccessToast,
    showErrorToast,
  )]: (state, { payload }) => {
    const id = uuid.v4();
    const toast = {
      id,
      ...payload,
    };
    const toasts = [
      ...state.toasts,
      toast,
    ];
    return {
      ...state,
      toasts,
    };
  },
  [hideToast]: (state, { payload }) => {
    const { id } = payload;
    const toasts = state.toasts.filter(toast => toast.id !== id);
    return {
      ...state,
      toasts,
    };
  },
}, defaultState);
