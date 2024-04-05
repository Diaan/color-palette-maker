import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Pattern, PatternColor } from '../../models/pattern';
import { ifDefined } from 'lit/directives/if-defined.js';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-pattern-viewer')
export class PatternViewer extends LitElement {

  @property({attribute: 'pattern-name'}) patternName!: string;

  @property({type:Number})
  imageScale:number = 50;

  @property({attribute:'defs', type: Object})
  defs?:any;

  @property({attribute: 'pattern-code'}) patternCode?: string;
  @property({ attribute: 'pattern-data', type:Object}) patternData?: Pattern;
  @property({type:Array}) colors?: PatternColor[];

  render() {
    return html`
      <h1>${this.patternData?.name}</h1>
      ${ unsafeHTML(this.patternCode)}
      <article>
        <p><sl-icon name="person-square" aria-label="Designer"></sl-icon> <a href=${ifDefined(this.patternData?.url)} target="_blank">${this.patternData?.designer}</a></p>
        <p>Colours:</p>
        <ul>
          ${this.patternData?.colors.map(c=>html`<li>${c.name}</li>`)}
        </ul>
      </article>  
      <div class="svg-defs"></div>
    `;
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('colors')) {
      //needs to be done in the same shadow dom as the pattern svg.
      this.#renderDefs();
    }
  }

  #renderDefs(): void{
    const svgContainer = this.renderRoot.querySelector('div');
      if(svgContainer){
        svgContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
          ${this.colors?.map(c => { 
            const color = c.pickedColor?c.pickedColor:c.default;
            const image = `yarns/${color.yarnFolder}/images/${color.image}`;
            return `<pattern id="img${color.patternYarn}" patternUnits="userSpaceOnUse" width="${this.imageScale}" height="${this.imageScale}" fill="var(--yarn${color.patternYarn})">
              <rect width="${this.imageScale}" height="${this.imageScale}" fill="${color.color}" />
              <image href="${image}" x="0" y="0" width="${this.imageScale}" height="${this.imageScale}" preserveAspectRatio="xMinYMin slice"/>
            </pattern>
            `}).join('\n')}
          </defs>
        </svg>`;
      }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column; 
    }
    h1 {
      color: var(--sl-color-primary-500);
    }

    .svg-defs{
      height: 0;
      width: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-viewer': PatternViewer;
  }
}
