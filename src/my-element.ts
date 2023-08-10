import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Pattern } from './pattern/pattern';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more';

  @state() selectedPattern?: Pattern;
  @state() patterns?: Pattern[];

  render() {
    return html`
    <!-- needs input "palette" to load correct json file-->
    <my-color-palette @updatePalette=${this.updatePalette} .number-of-colors=${this.selectedPattern?.colors}> </my-color-palette>

    <nav>
      ${this.patterns?.map(p => html`<button @click=${()=>this.selectedPattern = p}>${p.name}</button>`)}
    </nav>
    <my-pattern .pattern=${this.selectedPattern}> </my-pattern>
    `;
  }

  updatePalette(value: CustomEvent) {
    this.style.setProperty('--yarnA', value.detail[0].color);
    this.style.setProperty('--yarnB', value.detail[1].color);
    this.style.setProperty('--yarnC', value.detail[2].color);
    this.style.setProperty('--yarnD', value.detail[3].color);
    this.style.setProperty('--yarnE', value.detail[4].color);
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
    }
    nav {
      display: flex;
      flex-direction: column
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
