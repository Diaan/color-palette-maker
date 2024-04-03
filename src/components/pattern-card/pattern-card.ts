import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Pattern } from '../../models';


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
    <sl-card class="card-header">
      ${this.pattern.thumbnail?html`<img src="patterns/${this.pattern.folder}/${this.pattern.thumbnail}" 
      slot="image"/>`:nothing} 
      <h2>${this.pattern.name}</h2>
      <sl-icon name="person-square" aria-label="Designer"></sl-icon> ${this.pattern.designer}
      <div slot="footer">
        <small><sl-icon name="palette"></sl-icon> ${this.pattern.colors}</small>
        <sl-button variant="primary">Design</sl-button>
      </div>
    </sl-card>`;
  }

  static styles = css`
     :host {
      display: block;
    }
 
    sl-card {
      display: block
    }
 
    h2{
      font-size: var(--sl-font-size-large);
      margin: 0;
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
   
    [slot='footer'] {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-card': PatternCard;
  }
}
