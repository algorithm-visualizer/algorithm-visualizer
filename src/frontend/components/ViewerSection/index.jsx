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

    const tabs = ['Visualization', 'Description', 'Tracer API'].map((title, i) => ({
      title,
      props: {
        onClick: () => this.setTabIndex(i)
      },
    }));

    return (
      <section className={classes(styles.viewer_section, className)} style={style}>
        <TabBar tabs={tabs} tabIndex={tabIndex} />
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

