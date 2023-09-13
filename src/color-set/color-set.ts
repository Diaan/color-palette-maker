import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PaletteColor } from '../color-palette/color-palette';
import { Yarn } from '..';

export type ColorSet = { colors: PaletteColor[]; name: string };

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-color-set')
export class MyColorSet extends LitElement {
  /**
   * The number of times the button has been clicked.
   */
  @property({type:Array}) palette: PaletteColor[] = [];
  @property({type:Object}) yarn?: Yarn;

  @state() sets: ColorSet[] = [];

  render() {
    return html`<ul>
      ${this.sets.map(
        (set) =>
          html`<li @click=${()=>this.emitSet(set)}>
            <span>${set.name}</span>
            ${set.colors.map((color) =>
              html`<my-color-card .palette=${color} size="mini" .yarn=${this.yarn}></my-color-card>`
            )}
          </li>`
        )}
      </ul>
      `;
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('yarn') && this.yarn) {
      await this._getSets(this.yarn.folder).then((sets) => {
        if (sets) {
          this.sets = sets;
        }
      })
    }
  }

  emitSet(set: ColorSet): void {
    const options = {
      detail: set,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('selectSet', options));
  }

  async _getSets(folder: string): Promise<ColorSet[] | undefined> {
    try {
      const response = await fetch(`/yarns/${folder}/sets.json`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await response?.json();
      return json.sets;
    } catch (error) {
      console.warn('error loading pattern');
      return;
    }
  }

  static styles = css`
    :host() {
      display: flex;
      flex-direction: column;
      gap:8px;
    }

    ul {
      margin: 0;
      padding: 0;
    }

    li{
      display: flex;
      align-items: center;
      gap: 2px;

    }
    span {
      flex: 1 1 auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-color-set': MyColorSet;
  }
}
