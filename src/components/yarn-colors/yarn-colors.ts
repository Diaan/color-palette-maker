import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YarnColor } from '../../models';
import { CpSelectColorEvent, EventEmitter, event } from '../..';



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-yarn-colors')
export class YarnColors extends LitElement {

  @property() yarnColors?: YarnColor[] ;
  @property({attribute:'card-size', reflect: true}) cardSize = 'medium' ;

  /** Emits when the filter has been added or removed. */
  @event({name:'cp-select-color'}) selectColorEvent!: EventEmitter<CpSelectColorEvent>;

  render() {
    return html`<section>
      ${this.yarnColors?.map(c=> html`
        <cp-color-card .yarn=${c.yarn} .palette=${c} @click=${()=>this.select(c)} .size=${this.cardSize}></cp-color-card>
      `)}
    </section>`;
  }

  back(){
    this.dispatchEvent(new CustomEvent('close'));
  }

  select(yarn:YarnColor){
    this.selectColorEvent.emit(yarn);
  }  

  static styles = css`
    section {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }
    :host([card-size=large]) section {
      flex-direction: column;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-yarn-colors': YarnColors;
  }
}
