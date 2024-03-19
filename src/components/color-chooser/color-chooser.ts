import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PaletteColor } from '../..';
import { PatternColor, Yarn } from '../../models';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-color-chooser')
export class ColorChooser extends LitElement {
  @property({type:Array}) patternColors?: PatternColor[];

  @property({type:Object}) selectedYarn?: Yarn;

  @state() workingYarn = 'A';

  render() {
    //TODO: get selecting of working yarn working :D New event and so on
    return html`
    <cp-pattern-colors .patternColors=${this.patternColors} @click=${this.setWorkingYarn}></cp-pattern-colors>
    Recent colours:
    <cp-recent-colors></cp-recent-colors>
    ${this.selectedYarn ?
      html`<cp-yarn-colors @cp-select-color=${this.select} .yarnFolder=${this.selectedYarn.folder}></cp-yarn-colors>`:
      html`<cp-yarn-list @selectYarn=${this.selectYarn}></cp-yarn-list>`}
    `;
  }

  select ({ detail: color }: CustomEvent<PaletteColor>): void{
    console.log('select',color);
    document.body.style.setProperty(`--yarn${this.workingYarn}`, color.color);
    if(color.image){
      document.body.style.setProperty(`--yarn${this.workingYarn}-image`, `url(yarns/${this.selectedYarn?.folder}/images/${color.image})`);
    }
  }

  selectYarn(yarn: CustomEvent<Yarn>){
    this.selectedYarn = yarn.detail;
  }

  setWorkingYarn(){
    this.workingYarn = 'B';
  }

  static styles = css`

  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-color-chooser': ColorChooser;
  }
}
