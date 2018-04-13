import React from 'react';
import { classes } from '/common/util';
import { DescriptionViewer, RendererContainer, TabBar, WikiViewer } from '/components';
import styles from './stylesheet.scss';

class ViewerSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  setTabIndex(tabIndex) {
    this.setState({ tabIndex });
  }

  render() {
    const { className, style } = this.props;
    const { tabIndex } = this.state;

    return (
      <section className={classes(styles.viewer_section, className)} style={style}>
        <TabBar titles={['Visualization', 'Description', 'Tracer API']} selectedIndex={tabIndex}
                onClickTab={tabIndex => this.setTabIndex(tabIndex)} />
        <div className={styles.content} data-tab_index={tabIndex}>
          <RendererContainer className={styles.tab} />
          <DescriptionViewer className={styles.tab} />
          <WikiViewer className={styles.tab} />
        </div>
      </section>
    );
  }
}

export default ViewerSection;

