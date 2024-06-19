import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PatternColor, YarnBase } from '../../models';

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
    <sl-tab-group>
      <sl-tab slot="nav" panel="yarn">Yarn</sl-tab>
      <sl-tab slot="nav" panel="recent">Recent</sl-tab>
      <sl-tab slot="nav" panel="saved">Saved</sl-tab>

      <sl-tab-panel name="yarn">
        ${this.selectedYarn ?
          html` 
            <header>
              <h2>${this.selectedYarn.company} - ${this.selectedYarn.name}</h2>        
              <sl-button @click=${this.deselectYarn}>back</sl-button>
            </header>
            <cp-yarn-colors .yarnFolder=${this.selectedYarn.folder}></cp-yarn-colors>`:
          html`<cp-yarn-list></cp-yarn-list>`}
        
      </sl-tab-panel>
      <sl-tab-panel name="recent"><cp-recent-colors></cp-recent-colors></sl-tab-panel>
      <sl-tab-panel name="saved">Still in progress... Here you will see yarn combinations you have saved 😍</sl-tab-panel>
    </sl-tab-group>`;
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
    header {
      display: flex;
      justify-content: space-between;  
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-color-chooser': ColorChooser;
  }
}
