import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YarnColor } from '../models';
import { YarnList } from './yarn-list/yarn-list';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-color-card')
export class ColorCard extends LitElement {
  @property({type:Object}) palette?: YarnColor;
  @property({type:Boolean}) selected: boolean = false;
  @property() yarn?: string;
  @property({ reflect: true })  size: string = 'medium';

  @property() yarnImage?:string;

  override async willUpdate(changes: PropertyValues<this>): Promise<void> {
    super.willUpdate(changes);

    if (changes.has('yarn') || changes.has('palette')) {
      this.yarnImage = this.palette?.image;
    }
  }

  render() {
    const name = this.size==='large' || this.size==='xl' ? this.palette?.name : nothing;
    const image = this.palette?.image;
    const yarnInfo = this.palette ? YarnList.getYarnInfo(this.palette?.yarn):undefined;

    return this.palette?html`
      <div class="img" style="--_bg-color:${this.palette?.color};--_bg-image:url(${image})" title=${this.palette?.name}>
      </div>
      ${ this.size==='large' || this.size==='xl'
        ?html`
          <span>${name}</span>
          ${
            yarnInfo?
          
            html`<div class="meta">${yarnInfo.company} - ${yarnInfo.name}</div><sl-badge>${yarnInfo.weight}</sl-badge>`:
            nothing
          }
          
        `
        :nothing
      }
    `:nothing
  }
  static styles = css`
    :host {
      cursor:pointer;
    }
    :host([size="large"]){
      display: grid;
      gap: 4px 8px;
      grid-template-areas:
        'img color badge'
         'img meta badge';
      grid-template-columns: 50px 1fr;
    }
    :host([size="xl"]){
      display: flex;
      flex-direction: column;
      padding: 4px;
      gap: 8px;
      align-items: center;
      border: 1px solid red;
    }
    .img {
      background-color: var(--_bg-color);
      background-image: var(--yarn-image, var(--_bg-image));
      display: grid;
      width: 50px;
      aspect-ratio:1;
      border-radius: 50%;
      overflow: hidden;
      place-content: center;  background-size: cover;
      grid-area: img;
    }
    img {
      width: 100%;
      object-fit: cover;
      object-position: center center;
    }

    .meta {
      font-size: var(--sl-font-size-small);
      display: flex;
      grid-area: meta;
    }
    sl-badge {
      align-self: center;
      grid-area: badge;  
    }

    :host([size="mini"]) div{
      width: 1rem;
      border-radius: 2px;
    }

    :host([selected]) .img {
      outline: var(--_bg-color) outset 3px;
      outline-offset: 1px;
    }
    
    :host([selected][size="large"]) .img {
      outline: #fff solid 2px;
      outline-offset: -3px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-color-card': ColorCard;
  }
}
