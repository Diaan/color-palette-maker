import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Pattern } from '../../models/pattern';
import { CpSelectColorEvent, CpSelectYarnEvent, CpSetWorkingYarnEvent, EventsController } from '../../events';
import { PatternColors } from '../pattern-colors/pattern-colors';
import { PickedColor } from '../../models/color';
import { Yarn, YarnBase, YarnColor } from '../../models';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-palette-maker')
export class PaletteMaker extends LitElement {

  @property({attribute: 'pattern-name'}) patternName!: string;

  // @property()
  // imageScale:number = 50;

  @property({attribute:'defs', type: Object})
  defs?:any;

  @state() patternCode?: string;
  @state() patternData?: Pattern;
  @state() pickedColors: PickedColor[] = [];
  @state() selectedYarn?: YarnBase;
  @state() workingYarn?: string;

  /** Events controller. */
  #events = new EventsController(this, {
    'cp-select-color': this.#onSelectColor,
    'cp-select-yarn': this.#onSelectYarn,
    'cp-set-working-yarn': this.#onSetWorkingYarn
  });
  
  render() {
    return html`
      <button @click=${this.back}>back</button>
      <div></div>
      <section>
        ${
          this.patternData&&this.patternCode?
          html`<cp-pattern-viewer 
            .patternData=${this.patternData} 
            .patternCode=${this.patternCode} 
            .pickedColors=${this.pickedColors}></cp-pattern-viewer>`
          :nothing
        }
        <cp-color-chooser 
          .patternColors=${this.patternData?.colors} 
          .pickedColors=${this.pickedColors} 
          .selectedYarn=${this.selectedYarn}></cp-color-chooser>
      </section>
    `;
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('patternName') && this.patternName) {
      await this._getPatternInfo(this.patternName).then((p) => {
        if (p) {
          this.patternCode = p;
        }
      });
    }
  }

  back(){
    this.dispatchEvent(new CustomEvent('close'));
  }

  #onSelectColor(event: CpSelectColorEvent): void {
    const color = event.detail;
    if(!this.selectedYarn || !this.workingYarn) return;

    const pickedColor: PickedColor = {
      ...color,
      patternYarn: this.workingYarn,
      yarnFolder: this.selectedYarn.folder
    };
    document.body.style.setProperty(`--yarn${this.workingYarn}`, pickedColor.color);
    if(pickedColor.image){
      document.body.style.setProperty(`--yarn${this.workingYarn}-image`, `url(yarns/${this.selectedYarn?.folder}/images/${color.image})`);
    }
    this.pickedColors = [
      ... this.pickedColors.filter(pc => pc.patternYarn !==this.workingYarn),
      pickedColor
    ];
    localStorage.setItem(`pickedColors`, JSON.stringify(this.pickedColors));
  }

  #onSelectYarn(event: CpSelectYarnEvent){
    this.selectedYarn = event.detail;
  }

  #onSetWorkingYarn(event:CpSetWorkingYarnEvent){
    this.workingYarn = event.detail;
  }

  async _getPatternInfo(pattern: string): Promise<string | undefined> {
    try {
      const response = await fetch(`/patterns/${pattern}/info.json`);
      this.patternData = await response.json();
      const patterntext = await fetch(`/patterns/${pattern}/${this.patternData?.patternFile}`);
      this.pickedColors = this.patternData ? this.patternData?.colors.map(c=>c.default):[];
      console.log(this.pickedColors);
      const html = await patterntext.text();
      
      return html;
    } catch (error) {
      console.warn('error loading pattern');
      return;
    }
  }

  

  static styles = css`
    section {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-palette-maker': PaletteMaker;
  }
}
