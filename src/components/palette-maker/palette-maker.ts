import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Pattern, PatternColor } from '../../models/pattern';
import { CpSelectColorEvent, CpSelectYarnEvent, CpSetWorkingYarnEvent, EventsController } from '../../events';
import { PickedColor } from '../../models/color';
import { YarnBase, YarnColor } from '../../models';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-palette-maker')
export class PaletteMaker extends LitElement {

  @property({attribute: 'pattern-name'}) patternName!: string;

  @state() patternCode?: string;
  @state() patternData?: Pattern;
  @state() colors: PatternColor[] = [];
  @state() selectedYarn?: YarnBase;
  @state() workingYarn?: string = 'B';
  @state() recentColors:YarnColor[] = [];

  /** Events controller. */
  // eslint-disable-next-line
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
            .workingYarn=${this.workingYarn}
            .colors=${this.colors}></cp-pattern-viewer>`
          :nothing
        }
        </div>
        <div slot="end">

          <sl-tab-group>
            <sl-tab slot="nav" panel="yarn">Yarn</sl-tab>
            <sl-tab slot="nav" panel="recent">Recent</sl-tab>
            <sl-tab slot="nav" panel="saved">Saved</sl-tab>

            <sl-tab-panel name="yarn">
                <cp-color-chooser 
                  .workingYarn=${this.workingYarn}
                  .colors=${this.colors} 
                  .selectedYarn=${this.selectedYarn}></cp-color-chooser>
              
            </sl-tab-panel>
            <sl-tab-panel name="recent">
              <cp-yarn-colors .yarnColors=${this.recentColors} card-size="large"></cp-yarn-colors>
            </sl-tab-panel>
      <sl-tab-panel name="saved">Still in progress... Here you will see yarn combinations you have saved 😍</sl-tab-panel>
          </sl-tab-group>
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
  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);
    this.recentColors = JSON.parse(localStorage.getItem("recentColors")||'[]');
  }

  back(){
    this.dispatchEvent(new CustomEvent('close'));
  }

  #onSelectColor(event: CpSelectColorEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    
    const color = event.detail;
    if(!this.workingYarn) return;

    const pickedColor: PickedColor = {
      ...color,
      patternYarn: this.workingYarn,
      yarnFolder: color.yarn
    };
    this.#addToRecentColors(color);

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
    document.body.style.setProperty(`--yarn${workingYarn}`, pickedColor.color);
    if(pickedColor.image){
      document.body.style.setProperty(`--yarn${workingYarn}-image`, `url(${pickedColor.image})`);
    }
  }

  #addToRecentColors(color: YarnColor){
    const recentColors = JSON.parse(localStorage.getItem("recentColors")||'[]') as YarnColor[];
    if(!recentColors.find(c => c.name === color.name)){
      localStorage.setItem('recentColors',JSON.stringify([...recentColors, color]));
    }
  }

  async _getPatternInfo(pattern: string): Promise<string | undefined> {
    try {
      const response = await fetch(`/patterns/${pattern}/info.json`);
      this.patternData = await response.json();
      const patterntext = await fetch(`/patterns/${pattern}/${this.patternData?.patternFile}`);
      const colors =  this.patternData ? this.patternData?.colors:[];
      this.colors = await Promise.all(colors.map(async color=>{
        this.#setCSSProperties(color.id, color.default)
        return color;
      }));
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
