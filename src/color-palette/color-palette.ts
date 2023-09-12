import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type PaletteColor = { color: string; name: string, image?: string };

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

  render() {
    return html`
      <section>
      ${this.palette.map(
        (color) =>
          html`<my-color-card .palette=${color} ?selected=${this.selectedColors.some(
            (sc) => sc.name === color.name
          )} @click=${() => this.toggleColor(color)}></my-color-card>`
      )}
      </section>
      <h2>Colour sets:</h2>
      <my-color-set @selectSet=${this.selectSet}></my-color-set>

      <h2>Selected colours:</h2>
      <section class="selected">
        <draggable-list @updateOrder=${this.updateOrder}>
          ${this.selectedColors.map(
            (color) => html`
            <draggable-item .data=${color} @removeItem=${()=>this.removeColor(color)}>
              <my-color-card .palette=${color} size="large"></my-color-card>
            </draggable-item>`            
          )}
        </draggable-list>
      </section>
      `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this._getPalette('foxy-fibers').then((p) => {
      if (p) {
        this.palette = p;
        this.emitPalette(this.selectedColors);
      }
    });
  }

  toggleColor(color: PaletteColor): void {
    if (!this.selectedColors.some((sc) => sc === color)) {
      this.selectedColors = [...this.selectedColors, color];
      this.emitPalette(this.selectedColors);
    } else {
      this.removeColor(color);
    }
  }

  removeColor(color: PaletteColor): void {
    console.log(color, this.selectedColors);
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

  async _getPalette(name: string): Promise<PaletteColor[] | undefined> {
    try {
      const response = await fetch(`/yarns/${name}.json`);
      const json: { palette: PaletteColor[] } = await response?.json();
      return json?.palette;
    } catch (error) {
      console.warn('error loading palette');
      return;
    }
  }

  static styles = css`
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
