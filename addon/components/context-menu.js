import layout from '../templates/components/context-menu-item';

import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { tagName, classNames, className } from '@ember-decorators/component';
import invokeAction from 'ember-invoke-action';

@tagName('li')
@classNames('context-menu__item')
export default class ContextMenuItem extends Component.extend(layout) {

  @computed('isDisabled')
  @className
  get itemDisabled() {
    return this.isDisabled ? 'context-menu__item--disabled' : '';
  }

  @computed('_isParent')
  @className
  get itemParent() {
    return this._isParent ? 'context-menu__item--parent' : '';
  }

  @computed('_isParent', 'amount')
  get _amount() {
    let amount = get(this, 'amount');

    return !get(this, '_isParent') && amount > 1 && amount;
  }

  @computed('item')
  get _isParent() {
    return this.item.subActions && this.item.subActions.length > 0;
  }

  @computed('item.class')
  @className
  get userClassNames() {
    return this.item.class;
  }

  @computed('item.{disabled,action}', 'itemIsDisabled')
  get isDisabled() {
    return invokeAction(this, 'itemIsDisabled', this.item);
  }

  click() {
    if (!this.isDisabled && !this._isParent) {
      invokeAction(this, 'clickAction', this.item);
    }
  }
}
