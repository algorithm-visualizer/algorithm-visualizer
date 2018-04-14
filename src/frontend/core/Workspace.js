import uuid from 'uuid';
import React from 'react';
import { BasicSection, Divider, SectionContainer, TabSection } from '/components';

const minSize = 20;

class UISection {
  constructor(parent = null, weight = 1, visible = true) {
    this.id = uuid.v4();
    this.parent = parent;
    this.weight = weight;
    this.visible = visible;
  }

  setVisible(visible) {
    this.visible = visible;
    this.change();
  }

  isVisible() {
    return this.visible;
  }

  handleResize(target, clientX, clientY) {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = target.parentElement;
    let position, size;

    if (this.parent.horizontal) {
      position = clientX - offsetLeft;
      size = offsetWidth;
    } else {
      position = clientY - offsetTop;
      size = offsetHeight;
    }

    const visibleSections = this.parent.sections.filter(section => section.visible);
    const index = visibleSections.findIndex(section => section === this);
    const weights = visibleSections.map(section => section.weight);
    const totalWeight = weights.reduce((sumWeight, weight) => sumWeight + weight, 0);

    const startWeight = weights.slice(0, index).reduce((sumWeight, weight) => sumWeight + weight, 0);
    const endWeight = position / size * totalWeight;

    const oldWeight = weights[index];
    const newWeight = endWeight - startWeight;

    const oldScale = totalWeight - startWeight - oldWeight;
    const newScale = totalWeight - startWeight - newWeight;
    const ratio = newScale / oldScale;

    weights[index] = newWeight;
    for (let i = index + 1; i < weights.length; i++) {
      weights[i] *= ratio;
    }

    for (let i = index; i < weights.length; i++) {
      if (weights[i] / totalWeight * size < minSize) return;
    }

    for (let i = index; i < visibleSections.length; i++) {
      visibleSections[i].weight = weights[i];
    }

    this.change();
  }

  render(props) {
    return null;
  }

  renderDivider(props) {
    return (
      <Divider {...props} onResize={(target, x, y) => this.handleResize(target, x, y)} />
    );
  }

  change() {
    if (this.parent) this.parent.change();
  }
}

class UIBasicSection extends UISection {
  constructor(parent, Component, weight, visible) {
    super(parent, weight, visible);
    this.Component = Component;
  }

  render(props) {
    return (
      <BasicSection {...props} Component={this.Component} />
    );
  }
}

class UITabSection extends UISection {
  constructor(parent, weight, visible) {
    super(parent, weight, visible);
    this.tabs = [];
    this.tabIndex = 0;
  }

  addTab(title, Component) {
    const tab = { id: uuid.v4(), title, Component };
    this.tabs.push(tab);
    this.change();
    return tab;
  }

  setTabIndex(tabIndex) {
    this.tabIndex = tabIndex;
    this.change();
  }

  render(props) {
    return (
      <TabSection {...props} tabs={this.tabs} tabIndex={this.tabIndex}
                  onChangeTabIndex={tabIndex => this.setTabIndex(tabIndex)} />
    );
  }
}

class UIContainer extends UISection {
  constructor(parent, horizontal = true, weight, visible) {
    super(parent, weight, visible);
    this.horizontal = horizontal;
    this.sections = [];
  }

  setHorizontal(horizontal) {
    this.horizontal = horizontal;
    this.change();
  }

  addBasicSection(Component, weight) {
    const section = new UIBasicSection(this, Component, weight);
    this.sections.push(section);
    this.change();
    return section;
  }

  addTabSection(weight) {
    const section = new UITabSection(this, weight);
    this.sections.push(section);
    this.change();
    return section;
  }

  addContainer(horizontal, weight) {
    const container = new UIContainer(this, horizontal, weight);
    this.sections.push(container);
    this.change();
    return container;
  }

  render(props) {
    const visibleSections = this.sections.filter(section => section.visible);
    const weights = visibleSections.map(section => section.weight);
    const totalWeight = weights.reduce((sumWeight, weight) => sumWeight + weight, 0);
    return (
      <SectionContainer {...props} horizontal={this.horizontal}>
        {
          visibleSections.map(section => {
            const relativeWeight = section.weight / totalWeight;
            return [
              section.render({
                key: section.id,
                style: { flex: relativeWeight },
                relativeWeight,
              }),
              section.renderDivider({ key: `divider-${section.id}`, horizontal: this.horizontal }),
            ];
          }).reduce((flat, toFlatten) => flat.concat(toFlatten), [])
        }
      </SectionContainer>
    );
  }
}

class Workspace {
  constructor(horizontal) {
    this.rootContainer = new UIContainer(this, horizontal);
    this.onChange = null;
  }

  getRootContainer() {
    return this.rootContainer;
  }

  setHorizontal(horizontal) {
    this.rootContainer.setHorizontal(horizontal);
  }

  addBasicSection(Component, weight) {
    return this.rootContainer.addBasicSection(Component, weight);
  }

  addTabSection(weight) {
    return this.rootContainer.addTabSection(weight);
  }

  addContainer(horizontal, weight) {
    return this.rootContainer.addContainer(horizontal, weight);
  }

  render(props) {
    return this.rootContainer.render(props);
  }

  setOnChange(onChange) {
    this.onChange = onChange;
    this.change();
  }

  change() {
    if (this.onChange) this.onChange(this.rootContainer);
  }
}

export default Workspace;