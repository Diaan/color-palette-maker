import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PatternColor, PickedColor, YarnBase } from '../../models';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-color-chooser')
export class ColorChooser extends LitElement {
  @property({type:Array}) colors?: PatternColor[];

  @property({type:Object}) selectedYarn?: YarnBase;

  @property() workingYarn?: string;

  render() {
    return html`
    ${this.colors
      ?html`<cp-pattern-colors 
        .colors=${this.colors} 
        .workingYarn=${this.workingYarn}></cp-pattern-colors>`
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

  // override async updated(changes: PropertyValues<this>): Promise<void> {
  //   super.updated(changes);

  //   if (changes.has('colors') && this.colors) {
  //     console.log(this.colors, 'has changed');
  //   }
  // }

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
