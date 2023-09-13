import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PaletteColor } from './color-palette';
import { Yarn } from '..';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-color-card')
export class MyColorCard extends LitElement {
  @property() palette: PaletteColor = { color: `#000`, name: '' };
  @property() selected: boolean = false;
  @property() yarn?: Yarn;
  @property({ reflect: true })  size: string = 'medium';

  render() {
    const name = this.size==='large' ? this.palette.name : nothing;
    return html`
      <div style="--_bg:${this.palette.color}" title=${this.palette.name}>
        ${this.yarn?.folder && this.palette.image ? html`<img src="yarns/${this.yarn.folder}/images/${this.palette.image}">` : nothing}
      </div>
      ${name}
    `;
  }
  static styles = css`
    :host([size="large"]){
      display: flex;
      gap: 8px;
      align-items: center;
    }
    div {
      background-color: var(--_bg);
      display: grid;
      width: 50px;
      aspect-ratio:1;
      border-radius: 50%;
      overflow: hidden;
      place-content: center;
    }
    img {
      width: 100%;
      object-fit: cover;
      object-position: center center;
    }
    :host([size="mini"]) div{
      width: 1rem;
      border-radius: 2px;
    }

    :host([selected]) div {
      outline: var(--_bg) outset 3px;
      outline-offset: 1px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-color-card': MyColorCard;
  }
}
