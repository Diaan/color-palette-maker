import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Pattern } from './pattern/pattern';
import { PaletteColor } from './color-palette/color-palette';

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
  @state() patterns?: Pattern[];

  render() {
    return html`
    <!-- needs input "palette" to load correct json file-->
    <my-color-palette @updatePalette=${this.updatePalette} .number-of-colors=${this.selectedPattern?.colors}> </my-color-palette>

    <nav>
      Choose pattern:
      ${this.patterns?.map(p => html`<button @click=${()=>this.selectedPattern = p}>${p.name}</button>`)}
    </nav>
    <my-pattern .pattern=${this.selectedPattern}> </my-pattern>
    `;
  }

  updatePalette(value: CustomEvent) {
    this.keys.forEach((key:string) => {
      this.style.setProperty(`--yarn${key}`, 'transparent');
      this.style.removeProperty(`--yarn${key}-image`);
    });
    value.detail.forEach((color:PaletteColor,index:number) => {
      this.style.setProperty(`--yarn${this.keys[index]}`, color.color);
      if(color.image){
        this.style.setProperty(`--yarn${this.keys[index]}-image`, `url(yarns/foxy-fibers/${color.image})`);
      }
    });
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this._getPatterns().then((p) => {
      if (p) {
        this.patterns = p;
        if(!this.selectedPattern){
          this.selectedPattern = this.patterns[0];
        }
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

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 30% max-content 1fr;
      gap: 20px;
      padding: 20px;
    }
 
    nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background-color: #f3f3f3;
      padding: 4px;
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
