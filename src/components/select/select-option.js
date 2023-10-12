"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _onSlotchange, onSlotchange_fn;
import { observe } from "@sl-design-system/shared";
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./select-option.scss.js";
export class SelectOption extends LitElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onSlotchange);
    this.size = "md";
    this.selected = false;
    this.disabled = false;
  }
  handleSelectionChange() {
    this.setAttribute("aria-selected", this.selected ? "true" : "false");
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "option");
  }
  render() {
    return html`<slot @slotchange=${__privateMethod(this, _onSlotchange, onSlotchange_fn)}></slot>`;
  }
}
_onSlotchange = new WeakSet();
onSlotchange_fn = async function(event) {
  this.contentType = event.target.assignedNodes()[0].nodeType === 1 ? "element" : "string";
};
/** @private */
SelectOption.styles = styles;
__decorateClass([
  property({ reflect: true })
], SelectOption.prototype, "size", 2);
__decorateClass([
  property({ reflect: true })
], SelectOption.prototype, "contentType", 2);
__decorateClass([
  property()
], SelectOption.prototype, "value", 2);
__decorateClass([
  property({ reflect: true, type: Boolean })
], SelectOption.prototype, "selected", 2);
__decorateClass([
  property({ reflect: true, type: Boolean })
], SelectOption.prototype, "disabled", 2);
__decorateClass([
  observe("selected")
], SelectOption.prototype, "handleSelectionChange", 1);
//# sourceMappingURL=select-option.js.map
