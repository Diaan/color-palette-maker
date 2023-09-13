import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Pattern } from './pattern/pattern';
import { PaletteColor } from './color-palette/color-palette';

export type Yarn = { name: string; folder: string };

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  private keys = ['A','B','C','D','E','F'];

  @state() selectedPattern?: Pattern;
  @state() selectedYarn?: Yarn;
  @state() patterns?: Pattern[];
  @state() yarns?: Yarn[];
  @state() svgPatterns: any;

  render() {
    return html`
    <!-- needs input "palette" to load correct json file-->
    <section>
      <header> Yarn:
        <select @change=${(event:Event)=>this.selectYarn(event)}>
          <option></option>
          ${this.yarns?.map(y => html`<option value="${y.folder}" >${y.name}</option>`)}
        </select>
      </header>
      <my-color-palette @updatePalette=${this.updatePalette} .yarn=${this.selectedYarn} .number-of-colors=${this.selectedPattern?.colors}> </my-color-palette>
    </section>

    <section>
      <header> Pattern: 
      <select @change=${(event:Event)=>this.selectPattern(event)}>
          <option></option>
          ${this.patterns?.map(p => html`<option value="${p.file}" >${p.name}</option>`)}
        </select>
      </header>
      <my-pattern .pattern=${this.selectedPattern} .defs=${this.svgPatterns}> </my-pattern>
    </section>
    `;
  }

  updatePalette(value: CustomEvent) {
    this.keys.forEach((key:string) => {
      this.style.setProperty(`--yarn${key}`, 'transparent');
      this.style.removeProperty(`--yarn${key}-image`);
    });
    this.svgPatterns = value.detail.map( (color:PaletteColor, index:number) => {
      return {url: `yarns/foxy-fibers/images/${color.image}`, index: this.keys[index]}
    });
    value.detail.forEach((color:PaletteColor,index:number) => {
      this.style.setProperty(`--yarn${this.keys[index]}`, color.color);
      if(color.image){
        this.style.setProperty(`--yarn${this.keys[index]}-image`, `url(yarns/${this.selectedYarn?.folder}/images/${color.image})`);
      }
    });
  }

  selectYarn(event: Event): void {
    this.selectedYarn = this.yarns?.find(yarn => yarn.folder === (event.target as HTMLSelectElement).value);
  }

  selectPattern(event: Event): void {
    this.selectedPattern = this.patterns?.find(pattern => pattern.file === (event.target as HTMLSelectElement).value);
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this._getPatterns().then((p) => {
      if (p) {
        this.patterns = p;
        if(!this.selectedPattern){
        }
      }
    });

    await this._getYarns().then((y) => {
      if (y) {
        this.yarns = y;
      }
    });
  }

  async _getPatterns(): Promise<Pattern[] | undefined> {
    try {
      const response = await fetch(`/patterns.json`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await response?.json();
      return json.patterns;
    } catch (error) {
      console.warn('error loading pattern');
      return;
    }
  }

  async _getYarns(): Promise<Yarn[] | undefined> {
    try {
      const response = await fetch(`/yarns.json`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await response?.json();
      return json.yarns;
    } catch (error) {
      console.warn('error loading yarn');
      return;
    }
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 30% 1fr;
      gap: 20px;
    }

    section {
      display: flex;
      flex-direction:column;
      gap: 20px;
    }
 
    header {
      background-color: cornflowerblue;
      color: #efefef;
      padding: 10px;
    }

    button {
      font: inherit;
      border: 1px solid lightgrey;
      background-color: #efefef;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
