import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Yarn } from '../../models';
import { CpSelectColorEvent, EventEmitter, PaletteColor, event } from '../..';


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
    return html`${this.yarnData?.name} 
    <section>${this.yarnData?.palette.map(c=> html`
      <cp-color-card .yarn=${this.yarnData} .palette=${c} @click=${()=>this.select(c)}></cp-color-card>
    `)}</section>`;
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

  select(yarn:PaletteColor){
    this.selectColorEvent.emit(yarn);
  }

  async _getYarnInfo(folder: string): Promise<Yarn | undefined> {
    try {
      const response = await fetch(`/yarns/${folder}/info.json`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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