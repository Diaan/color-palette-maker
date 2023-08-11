import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type PaletteColor = { color: string; name: string };

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
  @property({type:Array}) palette: PaletteColor[] = [{ color: '#456789', name: 'bla' }];

  @property({attribute:'number-of-colors'}) numberOfColors: number = 1;

  @state() selectedColors: PaletteColor[] = [
    {
      name: 'dijon',
      color: '#b29012',
    },
    {
      name: 'white-peach',
      color: '#f5e6d7',
    },
    {
      name: 'sherbert',
      color: '#f3cbaa',
    },
    {
      name: 'sea-mist',
      color: '#a7bab1',
    },
    {
      name: 'enchanted',
      color: '#294650',
    },
  ];

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

      <h2>Selected colors:</h2>
      <section class="selected">
        <draggable-list @updateOrder=${this.updateOrder}>
          ${this.selectedColors.map(
            (color) => html`
            <draggable-item .data=${color} @removeItem=${()=>this.removeColor(color)}>
              <my-color-card .palette=${color} showname="true"></my-color-card>
            </draggable-item>`            
          )}
        </draggable-list>
      </section>
      `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this._getPalette('tandem').then((p) => {
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
      gap:8px;
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
