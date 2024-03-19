import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Pattern } from '../../models/pattern';


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

  render() {
    return html`
      <button @click=${this.back}>back</button>
      <div></div>
      <section>
        ${
          this.patternData&&this.patternCode?
          html`<cp-pattern-viewer .patternData=${this.patternData} .patternCode=${this.patternCode}></cp-pattern-viewer>`
          :nothing
        }
        <cp-color-chooser .patternColors=${this.patternData?.colors}></cp-color-chooser>
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

  async _getPatternInfo(pattern: string): Promise<string | undefined> {
    try {
      const response = await fetch(`/patterns/${pattern}/info.json`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.patternData = await response.json();
      this.patternData?.colors.forEach((color: any) => {
      document.body.style.setProperty(`--yarn${color.id}`, color.default);
      });
      const patterntext = await fetch(`/patterns/${pattern}/${this.patternData?.patternFile}`);
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
