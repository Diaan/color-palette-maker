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
@customElement('cp-color-chooser')
export class ColorChooser extends LitElement {
  @property({type:Object}) patternColors?: PatternColor[];

  c1:PaletteColor = { color: `#700`, name: '' };
  c2:PaletteColor = { color: `#070`, name: '' };
  c3:PaletteColor = { color: `#007`, name: '' };

  render() {
    console.log(this.patternColors);
    return html`
    <cp-pattern-colors .patternColors=${this.patternColors}></cp-pattern-colors>

    <cp-recent-colors></cp-recent-colors>`;
  }

  select(color: PaletteColor){
    document.body.style.setProperty(`--yarnA`, color.color);
  }

  static styles = css`

  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-color-chooser': ColorChooser;
  }
}
