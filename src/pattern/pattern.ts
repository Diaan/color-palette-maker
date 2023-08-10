import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-pattern')
export class MyPattern extends LitElement {
  @property()
  pattern: string = 'hilma';

  render() {
    return html`
      <h3>Svg:</h3>
      <my-pattern-shawl></my-pattern-shawl>
      <h3>HTML with background:</h3>
      <my-pattern-hilma></my-pattern-hilma>
    `;
  }
  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-pattern': MyPattern;
  }
}
