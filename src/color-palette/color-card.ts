import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PaletteColor } from './color-palette';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-color-card')
export class MyColorCard extends LitElement {
  @property()
  palette: PaletteColor = { color: `#000`, name: '' };

  @property()
  selected: boolean = false;

  @property({ reflect: true })
  showname: boolean = false;

  render() {
    const name = this.showname ? this.palette.name : nothing;
    return html`
      <div style="--_bg:${this.palette.color}"></div>
      ${name}
    `;
  }
  static styles = css`
    :host([showname]){
      display: flex;
      gap: 8px;
      align-items: center;
    }
    div {
      background-color: var(--_bg);
      display: block;
      width: 50px;
      aspect-ratio:1;
      border-radius: 50%;
    }

    :host([selected]) div {
      outline: var(--_bg) outset 2px;
      outline-offset: 1px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-color-card': MyColorCard;
  }
}
