import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Pattern, PatternColor } from '../../models/pattern';
import { CpSelectColorEvent, CpSelectYarnEvent, CpSetWorkingYarnEvent, EventsController } from '../../events';
import { PickedColor } from '../../models/color';
import { YarnBase } from '../../models';


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
  @state() colors: PatternColor[] = [];
  @state() selectedYarn?: YarnBase;
  @state() workingYarn?: string = 'B';

  /** Events controller. */
  #events = new EventsController(this, {
    'cp-select-yarn': this.#onSelectYarn,
    'cp-set-working-yarn': this.#onSetWorkingYarn,
    'cp-select-color': this.#onSelectColor
  });
  
  render() {
    return html`
      <sl-button @click=${this.back}>back</sl-button>
      <sl-split-panel position="35">
        <sl-icon slot="divider" name="grip-vertical"></sl-icon>
        <div slot="start">
        ${
          this.patternData&&this.patternCode?
          html`<cp-pattern-viewer 
            .patternData=${this.patternData} 
            .patternCode=${this.patternCode} 
            .colors=${this.colors}></cp-pattern-viewer>`
          :nothing
        }
        </div>
        <div slot="end">
          <cp-color-chooser 
            .workingYarn=${this.workingYarn}
            .colors=${this.colors} 
            .selectedYarn=${this.selectedYarn}></cp-color-chooser>
        </div>
      </sl-split-panel>
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
    event.preventDefault();
    event.stopPropagation();

    const color = event.detail;
    if(!this.selectedYarn || !this.workingYarn) return;

    const pickedColor: PickedColor = {
      ...color,
      patternYarn: this.workingYarn,
      yarnFolder: this.selectedYarn.folder
    };
    const workingColor = this.colors.find(c => c.id===this.workingYarn);
    if(!workingColor) return;

    workingColor.pickedColor = pickedColor;
    this.colors = [...this.colors];
    
    this.#setCSSProperties(this.workingYarn, pickedColor);

    localStorage.setItem(`patternColors`, JSON.stringify(this.colors));
  }

  #onSelectYarn(event: CpSelectYarnEvent){
    this.selectedYarn = event.detail;
  }

  #onSetWorkingYarn(event:CpSetWorkingYarnEvent){
    this.workingYarn = event.detail;
  }

  #setCSSProperties(workingYarn:string, pickedColor:PickedColor){
    console.log(pickedColor);
    document.body.style.setProperty(`--yarn${workingYarn}`, pickedColor.color);
    if(pickedColor.image){
      document.body.style.setProperty(`--yarn${workingYarn}-image`, `url(yarns/${this.selectedYarn?.folder}/images/${pickedColor.image})`);
    }
  }

  async _getPatternInfo(pattern: string): Promise<string | undefined> {
    try {
      const response = await fetch(`/patterns/${pattern}/info.json`);
      this.patternData = await response.json();
      const patterntext = await fetch(`/patterns/${pattern}/${this.patternData?.patternFile}`);
      this.colors = this.patternData ? this.patternData?.colors:[];
      this.colors.forEach(color=>this.#setCSSProperties(color.id, color.default))
      const html = await patterntext.text();
      
      return html;
    } catch (error) {
      console.warn('error loading pattern');
      return;
    }
  }

  

  static styles = css`
  :host {
      padding: var(--sl-spacing-2x-large);
      display: block;
    }
 
    h1 {
      color: var(--sl-color-primary-500);
    }

    sl-split-panel {
      --divider-width: 2px;
      gap: var(--sl-spacing-large);
    }

    sl-split-panel::part(divider) {
      background-color: var(--sl-color-pink-600);
    }

    sl-icon {
      position: absolute;
      border-radius: var(--sl-border-radius-small);
      background: var(--sl-color-pink-600);
      color: var(--sl-color-neutral-0);
      padding: 0.5rem 0.125rem;
    }

    sl-split-panel::part(divider):focus-visible {
      background-color: var(--sl-color-primary-600);
    }

    sl-split-panel:focus-within sl-icon {
      background-color: var(--sl-color-primary-600);
      color: var(--sl-color-neutral-0);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-palette-maker': PaletteMaker;
  }
}
