import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PickedColor, PatternColor, Yarn, YarnColor, YarnBase } from '../../models';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-color-chooser')
export class ColorChooser extends LitElement {
  @property({type:Array}) patternColors?: PatternColor[];

  @property({type:Object}) selectedYarn?: YarnBase;

  @property() workingYarn = 'A';

  render() {
    //TODO: get selecting of working yarn working :D New event and so on
    return html`
    ${this.patternColors
      ?html`<cp-pattern-colors .patternColors=${this.patternColors}></cp-pattern-colors>`
      :nothing
    }
    <!--Recent colours:
    <cp-recent-colors></cp-recent-colors> -->
    ${this.selectedYarn ?
      html`${this.selectedYarn.name} 
        <button @click=${this.deselectYarn}>back</button><br/>
        <cp-yarn-colors .yarnFolder=${this.selectedYarn.folder}></cp-yarn-colors>`:
      html`<cp-yarn-list></cp-yarn-list>`}
    `;
  }

  deselectYarn(){
    this.selectedYarn = undefined;
  }

  setWorkingYarn(workingYarn: CustomEvent<PatternColor>){
    this.workingYarn = workingYarn.detail.id;
  }

  static styles = css`

  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-color-chooser': ColorChooser;
  }
}
