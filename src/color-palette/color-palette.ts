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
            (sc) => sc === color
          )} @click=${() => this.toggleColor(color)}></my-color-card>`
      )}
      </section>

      <h2>Selected colors:</h2>
      <section class="selected">
        ${this.selectedColors.map(
          (color) =>
          html`<my-color-card .palette=${color} showname="true" @click=${() =>
            this.toggleColor(color)}></my-color-card>`
            
            )}
        <!--<my-sortable-list positions=${this.numberOfColors} @update=${(e: any)=>console.log(e)}>
        </my-sortable-list>-->
      </section>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this._getPalette('tandem').then((p) => {
      if (p) {
        this.palette = p;
        this.emitPalette();
      }
    });
  }

  toggleColor(color: PaletteColor): void {
    if (!this.selectedColors.some((sc) => sc === color)) {
      this.selectedColors = [...this.selectedColors, color];
    } else {
      this.selectedColors = this.selectedColors.filter((obj) => obj !== color);
    }
    this.emitPalette();
  }

  emitPalette(): void {
    const options = {
      detail: this.selectedColors,
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
