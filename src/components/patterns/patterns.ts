import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Pattern } from '../../pattern/pattern';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-patterns')
export class Patterns extends LitElement {

  @state() selectedPattern?: Pattern;
  @state() patterns?: Pattern[];  
  

  render() {
    return html`
      <h1>Patterns:</h1>
      <section>
      ${this.patterns?.map(p => html`<cp-pattern-card  @click=${()=> this.selectPattern(p)} .pattern="${p}" ></cp-pattern-card>`)}
      </section>
    `;
  }
  selectPattern(pattern: Pattern): void {
    this.selectedPattern = pattern;
    const options = {
      detail: pattern,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('selectPattern', options));
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this._getPatterns().then((p) => {
      if (p) {
        this.patterns = p;
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
      padding: 20px;
    }
    section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
 
    h1 {
      background-color: cornflowerblue;
      color: #efefef;
      padding: 10px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-patterns': Patterns;
  }
}