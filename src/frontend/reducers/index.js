import { actions as currentActions } from './current';
import { actions as directoryActions } from './directory';
import { actions as envActions } from './env';
import { actions as playerActions } from './player';
import { actions as toastActions } from './toast';

export { default as current } from './current';
export { default as directory } from './directory';
export { default as env } from './env';
export { default as player } from './player';
export { default as toast } from './toast';

export const actions = {
  ...currentActions,
  ...directoryActions,
  ...envActions,
  ...playerActions,
  ...toastActions,
};
