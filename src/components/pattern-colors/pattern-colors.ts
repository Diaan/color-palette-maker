import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PaletteColor } from '../..';
import { PatternColor } from '../../models/pattern';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-pattern-colors')
export class PatternColors extends LitElement {
  @property({type:Object}) patternColors?: PatternColor[];

  render() {
    return html`
      <h2>Colours</h2>
      ${this.patternColors?.map(pc=>html`
        <cp-color-card size="large" .palette=${{color:pc.default,name:pc.name}} @click=${()=>selectWorkingColor(pc)}></cp-color-card>
      `)}`;
  }

  selectWorkingColor(color:PatternColor): void{
    console.log(color);
  }

  static styles = css`
    :host {
      display:flex;
      flex-direction: column;
      gap: 5px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-colors': PatternColors;
  }
}
