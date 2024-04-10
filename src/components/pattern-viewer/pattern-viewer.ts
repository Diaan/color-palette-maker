import { LitElement, PropertyValues, css, html, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  @state() imageScale:number = 50;
  @state() blurRadius:number = 2;
  @property({type:Boolean}) yarnImage:boolean = true;

  @property({attribute:'defs', type: Object})
  defs?:any;


  @property({attribute: 'pattern-code'}) patternCode?: string;
  @property({ attribute: 'pattern-data', type:Object}) patternData?: Pattern;
  @property({type:Array}) colors?: PatternColor[];

  render() {
    return html`
      <h1>${this.patternData?.name}</h1>
      <span><sl-icon name="person-square" aria-label="Designer"></sl-icon> <a href=${ifDefined(this.patternData?.url)} target="_blank">${this.patternData?.designer}</a></span>
      ${ unsafeHTML(this.patternCode)}
      <!--${this.yarnImage}-->
      <sl-divider></sl-divider>
      <sl-switch ?checked=${this.yarnImage} @sl-change=${this.#changeYarnImage} class="label-on-left">Show yarn image</sl-switch>
      <sl-range min="0" max="50" step="1" value=${this.blurRadius} @sl-change=${this.#changeBlurRadius} label="Blur yarn image" class="label-on-left"></sl-range>
      <!--article>
        <p>Colours:</p>
        <ul>
          ${this.patternData?.colors.map(c=>html`<li>${c.name}</li>`)}
        </ul>
      </article 
      ${svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox=" 0 0 ${(this.colors?.length||5) * 100} ${(this.colors?.length||5) * 100}">
            ${this.colors?.map((c,i) => { 
              const color = c.pickedColor?c.pickedColor:c.default;
              const image = `yarns/${color.yarnFolder}/images/${color.image}`;
              const x = 100 * i;
              const y = 0;
              return svg`
                <rect width="${this.imageScale}"  x=${x} y=${y} height="${this.imageScale}" fill="${color.color}"></rect>
                <image href="${image}" x=${x} y=${y} width="${this.imageScale}" height="${this.imageScale}" preserveAspectRatio="xMinYMin slice" filter="url(#f1)"/>
                <image href="${image}" x=${x} y=${y} width="${this.imageScale}" height="${this.imageScale}" preserveAspectRatio="xMinYMin slice"/>
              `})}
        </svg>`}--> 
      <div class="svg-defs"> ${this.yarnImage}
        ${svg`<svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f1" x="0" y="0" xmlns="http://www.w3.org/2000/svg">
              <feGaussianBlur in="SourceGraphic" stdDeviation="${this.blurRadius}" />
            </filter>
            ${this.colors?.map(c => { 
              const color = c.pickedColor?c.pickedColor:c.default;
              const image = `yarns/${color.yarnFolder}/images/${color.image}`;
              return svg`
                <pattern 
                  id="img${color.patternYarn}" 
                  patternUnits="userSpaceOnUse" 
                  width="${this.imageScale}" 
                  height="${this.imageScale}" 
                  fill="var(--yarn${color.patternYarn})">
                <rect width="${this.imageScale}" height="${this.imageScale}" fill="${color.color}"></rect>
                ${this.yarnImage
                  ?svg`<image href="${image}" x="0" y="0" width="${this.imageScale}" height="${this.imageScale}" preserveAspectRatio="xMinYMin slice" filter="url(#f1)"/>`
                  :nothing
                }
              </pattern>
              `})}
          </defs>
        </svg>`}
      </div>
    `;
  }

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('colors')) {

    }
  }

  // TODO: tweak image position, scale, blur, toggle images of yarn, toggle image or color rectangles

  #changeBlurRadius(event: Event & { target: HTMLInputElement }):void {
    this.blurRadius = parseInt(event.target.value);
  }

  #changeYarnImage(event: Event & { target: HTMLInputElement }):void {
    this.yarnImage = event.target.checked;   
    this.colors = [...this.colors||[]];
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
      overflow: hidden;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-viewer': PatternViewer;
  }
}
