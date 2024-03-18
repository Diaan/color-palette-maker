import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Pattern } from '../../models/pattern';
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

  @property()
  imageScale:number = 50;

  @property({attribute:'defs', type: Object})
  defs?:any;

  @property({attribute: 'pattern-code'}) patternCode?: string;
  @property({ attribute: 'pattern-data', type:Object}) patternData?: Pattern;

  render() {
    return html`${ unsafeHTML(this.patternCode)}
    <article>
      <h1>${this.patternData?.name}</h1>
      <p><a href=${ifDefined(this.patternData?.url)} target="_blank">${this.patternData?.designer}</a></p>
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

    console.log(this.patternCode);

    if (changes.has('patternData')) {
      //needs to be done in the same shadow dom as the pattern svg.
      const svgContainer = this.renderRoot.querySelector('div');
      if(svgContainer){
        svgContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
          ${this.patternData?.colors.map((def:{id:string, default:string}) => 
            `<pattern id="img${def.id}" patternUnits="userSpaceOnUse" width="${this.imageScale}" height="${this.imageScale}" fill="var(--yarn${def.id})">
              <rect width="${this.imageScale}" height="${this.imageScale}" fill="var(--yarn${def.id})" />
            </pattern>
            `).join('\n')}
          </defs>
        </svg>`;
      }
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 20px;
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
