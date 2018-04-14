import uuid from 'uuid';
import React from 'react';
import { BasicSection, Divider, SectionContainer, TabSection } from '/components';

const minSize = 20;

class UISection {
  constructor(parent = null, { weight = 1, visible = true, removable = true } = {}) {
    this.id = uuid.v4();
    this.parent = parent;
    this.weight = weight;
    this.visible = visible;
    this.removable = removable;
  }

  setVisible(visible) {
    this.visible = visible;
    this.change();
  }

  isVisible() {
    return this.visible;
  }

  remove() {
    if (!this.removable) return;
    this.parent.sections = this.parent.sections.filter(section => section !== this);
    if (this.parent.sections.length) this.change();
    else this.parent.remove();
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
  constructor(parent, Component, options) {
    super(parent, options);
    this.Component = Component;
  }

  render(props) {
    return (
      <BasicSection {...props} Component={this.Component} />
    );
  }
}

class UITab extends UISection {
  constructor(parent, title, Component, options) {
    super(parent, options);
    this.title = title;
    this.Component = Component;
  }

  setTitle(title) {
    this.title = title;
    this.change();
  }

  setComponent(Component) {
    this.Component = Component;
    this.change();
  }

  render(props) {
    const { Component } = this;
    return (
      <Component {...props} />
    );
  }
}

class UITabSection extends UISection {
  constructor(parent, options) {
    super(parent, options);
    this.sections = [];
    this.tabIndex = 0;
  }

  addTab(title, Component, options) {
    const tab = new UITab(this, title, Component, options);
    this.sections.push(tab);
    this.change();
    return tab;
  }

  setTabIndex(tabIndex) {
    this.tabIndex = tabIndex;
    this.change();
  }

  render(props) {
    const titles = this.sections.map(tab => tab.title);
    return (
      <TabSection {...props} titles={titles} tabIndex={this.tabIndex}
                  onChangeTabIndex={tabIndex => this.setTabIndex(tabIndex)}>
        {
          this.sections[this.tabIndex].render({})
        }
      </TabSection>
    );
  }
}

class UIContainer extends UISection {
  constructor(parent, { horizontal = true, ...options } = {}) {
    super(parent, options);
    this.horizontal = horizontal;
    this.sections = [];
  }

  setHorizontal(horizontal) {
    this.horizontal = horizontal;
    this.change();
  }

  addBasicSection(Component, options) {
    const section = new UIBasicSection(this, Component, options);
    this.sections.push(section);
    this.change();
    return section;
  }

  addTabSection(options) {
    const section = new UITabSection(this, options);
    this.sections.push(section);
    this.change();
    return section;
  }

  addContainer(options) {
    const container = new UIContainer(this, options);
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
    this.rootContainer = new UIContainer(this, { horizontal });
    this.onChange = null;
    this.shouldChange = true;
  }

  getRootContainer() {
    return this.rootContainer;
  }

  setHorizontal(horizontal) {
    this.rootContainer.setHorizontal(horizontal);
  }

  addBasicSection(Component, options) {
    return this.rootContainer.addBasicSection(Component, options);
  }

  addTabSection(options) {
    return this.rootContainer.addTabSection(options);
  }

  addContainer(options) {
    return this.rootContainer.addContainer(options);
  }

  render(props) {
    return this.rootContainer.render(props);
  }

  setOnChange(onChange) {
    this.onChange = onChange;
    this.change();
  }

  change() {
    if (this.shouldChange && this.onChange) this.onChange(this.rootContainer);
  }

  disableChange() {
    this.shouldChange = false;
  }

  enableChange() {
    this.shouldChange = true;
  }
}

const workspace = new Workspace();
export default workspace;