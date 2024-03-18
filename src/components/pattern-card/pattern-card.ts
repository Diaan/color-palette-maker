import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Pattern } from '../../pattern/pattern';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-pattern-card')
export class PatternCard extends LitElement {

  @property({type: Object}) pattern!: Pattern;

  render() {
    return html`
    ${this.pattern.thumbnail?html`<img src="patterns/${this.pattern.folder}/${this.pattern.thumbnail}"/>`:nothing} 
    <h1>${this.pattern.name}</h1>`;
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 30% 1fr;
      gap: 20px;
      border: 1px solid red;
    }

    img {
      aspect-ratio: 1/1;
      block-size: auto;
      box-sizing: border-box;
      inline-size: 100%;
      object-fit: cover;
      object-position: var(--_object-position);
      overflow: hidden;
      padding: var(--_media-padding-full);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-card': PatternCard;
  }
}
