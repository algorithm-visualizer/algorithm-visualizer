import React from 'react';
import { connect } from 'react-redux';
import { classes } from '/common/util';
import { DescriptionViewer, RendererContainer, TabBar, WikiViewer } from '/components';
import { actions as envActions } from '/reducers/env';
import styles from './stylesheet.scss';

@connect(
  ({ env }) => ({
    env
  }), {
    ...envActions
  }
)
class ViewerSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  componentWillReceiveProps(nextProp) {
    const { algorithm } = nextProp.env;
    if (algorithm !== this.props.env.algorithm) {
      this.setTabIndex(0);
    }
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

