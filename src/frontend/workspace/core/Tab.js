import { SectionContainer } from './index';

class Tab extends SectionContainer {
  getDefaultProps() {
    return {
      ...super.getDefaultProps(),
      title: '',
    }
  }
}

export default Tab;