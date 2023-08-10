import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more';

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  render() {
    return html`
    <!-- needs input "palette" to load correct json file-->
    <my-color-palette @updatePalette=${this.updatePalette}> </my-color-palette>

    <!-- needs input "pattern" to load correct patternComponent-->
    <my-pattern> </my-pattern>
    `;
  }

  updatePalette(value: CustomEvent) {
    this.style.setProperty('--yarnA', value.detail[0].color);
    this.style.setProperty('--yarnB', value.detail[1].color);
    this.style.setProperty('--yarnC', value.detail[2].color);
    this.style.setProperty('--yarnD', value.detail[3].color);
    this.style.setProperty('--yarnE', value.detail[4].color);
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 30% 1fr;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
