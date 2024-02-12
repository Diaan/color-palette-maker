import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Yarn } from '..';

export type PaletteColor = { color: string; name: string, image?: string };
declare global {
  interface Window {
    CPM: {
      palette: PaletteColor[];
    };
  }
}

window.CPM ||= { palette: [] };
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-color-palette')
export class MyColorPalette extends LitElement {
  /**
   * The number of times the button has been clicked.
   */
  @property({type:Array}) palette: PaletteColor[] = [];

  @property({attribute:'number-of-colors', type: Number}) numberOfColors: number = 1;

  @state() selectedColors: PaletteColor[] = [];
  @property({type:Object}) yarn?: Yarn;

  render() {
    return this.yarn ? html`
      <section>
      ${this.palette.map(
        (color) =>
          html`<my-color-card .palette=${color} .yarn=${this.yarn} ?selected=${this.selectedColors.some(
            (sc) => sc.name === color.name
          )} @click=${() => this.toggleColor(color)}></my-color-card>`
      )}
      </section>
      <h2>Colour sets:</h2>
      <my-color-set @selectSet=${this.selectSet} .yarn=${this.yarn}></my-color-set>

      <h2>Selected colours:</h2>
      ${
        this.selectedColors.length>0 ? 
        html`
          <section class="selected">
            <draggable-list @updateOrder=${this.updateOrder}>
              ${this.selectedColors.map(
                (color) => html`
                <draggable-item .data=${color} @removeItem=${()=>this.removeColor(color)}>
                  <my-color-card .palette=${color} size="large" .yarn=${this.yarn}></my-color-card>
                </draggable-item>`            
              )}
            </draggable-list>
          </section>
        `: html`
          <p>Select some colours from the palette above or choose a ready made set.</p>
        `
      }
      
      ` : 
      html`Please choose a yarn above`;
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('yarn') && this.yarn) {
      await this._getPalette(this.yarn.folder).then((p) => {
        if (p) {
          this.palette = p;
          console.log(this.palette);
          this.emitPalette(this.selectedColors);
        }
      });
      this.selectedColors = [];
      this.emitPalette([]);
    }
  }

  toggleColor(color: PaletteColor): void {
    if (!this.selectedColors.some((sc) => sc.name === color.name)) {
      this.selectedColors = [...this.selectedColors, color];
      console.log(this.selectedColors);
      this.emitPalette(this.selectedColors);
    } else {
      this.removeColor(color);
    }
  }

  removeColor(color: PaletteColor): void {
    this.selectedColors = this.selectedColors.filter((obj) => obj.name !== color.name);
    this.emitPalette(this.selectedColors);
  }

  //@ts-ignore
  updateOrder(data): void {
    this.selectedColors = data.detail;
    this.emitPalette(data.detail);
  }

  //@ts-ignore
  selectSet(data): void {
    this.selectedColors = data.detail.colors;
    this.emitPalette(data.detail.colors);
  }

  emitPalette(palette: PaletteColor[]): void {
    const options = {
      detail: palette,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('updatePalette', options));
  }

  async _getPalette(folder: string): Promise<PaletteColor[] | undefined> {
    try {
      const response = await fetch(`/yarns/${folder}/info.json`);
      const json: { palette: PaletteColor[] } = await response?.json();
      window.CPM.palette = json.palette;
      return json?.palette;
    } catch (error) {
      console.warn('error loading palette');
      return;
    }
  }

  static styles = css`
    :host {
      padding: 10px;
    }

    section {
      display: flex;
      flex-wrap: wrap;
      gap:10px;
    }

    section.selected{
      flex-direction: column;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-color-palette': MyColorPalette;
  }
}
