import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { YarnBase, YarnColor } from '../../models';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-color-chooser')
export class ColorChooser extends LitElement {
  @property({type:Array}) colors?: YarnColor[];

  @property({type:Object}) selectedYarn?: YarnBase;

  @property() workingYarn?: string;
  
  @state() yarnColors?: YarnColor[] ;

  render() {
    return html`
    
        ${this.selectedYarn ?
          html` 
            <header>
              <h2>${this.selectedYarn.company} - ${this.selectedYarn.name}</h2>        
              <sl-button @click=${this.deselectYarn}>back</sl-button>
            </header>
            <cp-yarn-colors .yarnColors=${this.yarnColors}></cp-yarn-colors>`:
          html`<cp-yarn-list></cp-yarn-list>`}`;
  }

  deselectYarn(){
    this.selectedYarn = undefined;
  }

  async _getYarnInfo(folder: string): Promise<YarnColor[] | undefined> {
    try {
      const response = await fetch(`/yarns/${folder}/colors.json`);
       
      const data = await response.json();
      return data.colors;
    } catch (error) {
      console.warn('error loading yarn info');
      return;
    }
  }  

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('selectedYarn') && this.selectedYarn) {
      await this._getYarnInfo(this.selectedYarn.folder).then((p) => {
        if (p) {
          this.yarnColors = p;
        }
      });
    }
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
