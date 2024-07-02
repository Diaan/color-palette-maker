import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Yarn, YarnColor } from '../../models';
import { ColorCard, CpSelectColorEvent, EventEmitter, event } from '../..';
import { getBase64FromImageUrl } from '../../util/image';



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-yarn-colors')
export class YarnColors extends LitElement {

  @property({attribute: 'yarn-folder'}) yarnFolder!: string;

  @state() yarnData?: Yarn ;

  /** Emits when the filter has been added or removed. */
  @event({name:'cp-select-color'}) selectColorEvent!: EventEmitter<CpSelectColorEvent>;

  render() {
    return html`<section>
      ${this.yarnData?.palette.map(c=> html`
        <cp-color-card .yarn=${this.yarnData} .palette=${c} @click=${()=>this.select(c)}></cp-color-card>
      `)}
    </section>`;
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('yarnFolder') && this.yarnFolder) {
      await this._getYarnInfo(this.yarnFolder).then((p) => {
        if (p) {
          this.yarnData = p;
        }
      });
    }
  }

  back(){
    this.dispatchEvent(new CustomEvent('close'));
  }

  select(yarn:YarnColor){
    this.selectColorEvent.emit(yarn);
  }

  // async select(yarn:YarnColor, event:Event){
  //   const card = event?.target as ColorCard;
  //   if(yarn.image && card.yarnImage){
  //     const base64 = await getBase64FromImageUrl(card.yarnImage);
  //     this.selectColorEvent.emit({...yarn, base64});
  //   }else{
  //     this.selectColorEvent.emit({...yarn, base64:undefined});
  //   }
  // }

  async _getYarnInfo(folder: string): Promise<Yarn | undefined> {
    try {
      const response = await fetch(`/yarns/${folder}/info.json`);
       
      const data = await response.json();
      this.yarnData = {...data, folder};
      return this.yarnData;
    } catch (error) {
      console.warn('error loading yarn info');
      return;
    }
  }  

  static styles = css`
    section {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-yarn-colors': YarnColors;
  }
}
