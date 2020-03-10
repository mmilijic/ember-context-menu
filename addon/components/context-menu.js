import layout from '../templates/components/context-menu';
import invokeAction from 'ember-invoke-action';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';

export default class EmberContextMenu extends Component.extend(layout) {

  @service('context-menu') contextMenu;

  @computed('contextMenu.isActive') get isActive() {
    return this.contextMenu.isActive;
  }

  @computed('contextMenu.renderLeft') get renderLeft() {
    return this.contextMenu.renderLeft;
  }

  @computed('contextMenu.items') get items() {
    return this.contextMenu.items;
  }

  @computed('contextMenu.selection') get _selection() {
    return this.contextMenu.selection;
  }

  @computed('contextMenu.details') get details() {
    return this.contextMenu.details;
  }

  @computed('contextMenu.event') get clickEvent() {
    return this.contextMenu.event;
  }

  @computed('_selection.[]')
  get selection() {
    return [].concat(this._selection);
  }

  @computed('contextMenu')
  get cmClass() {
    return this.contextMenu.ContextMenuClass;
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.setWormholeTarget();
  }

  setWormholeTarget() {
    let id = 'wormhole-context-menu';
    let target = document.querySelectorAll(`#${ id }`);
    if (target.length === 0) {
      document.body.insertAdjacentHTML('beforeend', `<div id="${ id }"></div>`);
    }
  }

  @computed('contextMenu.position.{left,top}')
  get position() {
    let { left, top } = this.contextMenu.position || {};
    return htmlSafe(`left: ${ left }px; top: ${ top }px;`);
  }

  @computed('selection.[]', 'details')
  get itemIsDisabled() {
    let selection = this.selection || [];
    let details = this.details;

    return function (item) {
      let disabled = this.item.disabled;

      if (!this.item.action && !this.item.subActions) {
        return true;
      }

      if (typeof disabled === 'function') {
        return disabled(selection, details);
      }

      return disabled;
    };
  }

  @computed('selection.[]', 'details')
  get clickAction() {
    let selection = this.selection;
    let details = this.details;
    let event = this.clickEvent;

    return function (item) {
      invokeAction(item, 'action', selection, details, event);
    };
  }
}
