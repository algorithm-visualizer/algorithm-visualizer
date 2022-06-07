import { createAction, handleActions } from "redux-actions";

const prefix = "DIRECTORY";

const setCategories = createAction(
  `${prefix}/SET_CATEGORIES`,
  (categories) => ({ categories })
);
const setScratchPapers = createAction(
  `${prefix}/SET_SCRATCH_PAPERS`,
  (scratchPapers) => ({ scratchPapers })
);

export const actions = {
  setCategories,
  setScratchPapers,
};

const defaultState = {
  categories: [],
  scratchPapers: [],
};

export default handleActions(
  {
    [setCategories]: (state, { payload }) => {
      const { categories } = payload;
      return {
        ...state,
        categories,
      };
    },
    [setScratchPapers]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  defaultState
);
