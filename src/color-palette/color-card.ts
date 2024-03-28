import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Yarn, YarnColor } from '../models';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-color-card')
export class ColorCard extends LitElement {
  @property({type:Object}) palette: YarnColor = { color: `#000`, name: '' };
  @property({type:Boolean}) selected: boolean = false;
  @property({type:Object}) yarn?: Yarn;
  @property({ reflect: true })  size: string = 'medium';

  render() {
    const name = this.size==='large' ? this.palette.name : nothing;
    const image = `yarns/${this.yarn?.folder}/images/${this.palette.image}`;

    return html`
      <div style="--_bg-color:${this.palette.color};--_bg-image:url(${image})" title=${this.palette.name}>
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
      background-color: var(--_bg-color);
      background-image: var(--yarn-image, var(--_bg-image));
      display: grid;
      width: 50px;
      aspect-ratio:1;
      border-radius: 50%;
      overflow: hidden;
      place-content: center;  background-size: cover;
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
      outline: var(--_bg-color) outset 3px;
      outline-offset: 1px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-color-card': ColorCard;
  }
}
