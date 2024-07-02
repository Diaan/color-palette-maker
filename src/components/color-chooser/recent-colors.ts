import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { YarnColor } from '../../models';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-recent-colors')
export class RecentColors extends LitElement {

  c1:YarnColor = { color: `#700`, name: '' };
  c2:YarnColor = { color: `#070`, name: '' };
  c3:YarnColor = { color: `#007`, name: '' };

  render() {
    return html`<cp-color-card .palette=${this.c1} @click=${()=>this.select(this.c1)}></cp-color-card>
    <cp-color-card .palette=${this.c2} @click=${()=>this.select(this.c2)}></cp-color-card>
    <cp-color-card .palette=${this.c3} @click=${()=>this.select(this.c3)}></cp-color-card>`;
  }

  select(color: YarnColor){
    document.body.style.setProperty(`--yarnA`, color.color);
  }

  static styles = css`
    :host {
      display:flex;
      gap: 5px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-recent-colors': RecentColors;
  }
}
