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
      <sl-button @click=${this.#saveImage}>Dowload image</sl-button>
      <sl-divider></sl-divider>
      <sl-switch ?checked=${this.yarnImage} @sl-change=${this.#changeYarnImage} class="label-on-left">Show yarn image</sl-switch>
      <sl-range min="0" max="50" step="1" value=${this.blurRadius} @sl-change=${this.#changeBlurRadius} label="Blur yarn image" class="label-on-left"></sl-range>
      <!--
        tweak part of image / blur that is shown in the pattern image  
      <article>
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
      <div class="svg-defs">
        ${svg`<svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f1" x="0" y="0" xmlns="http://www.w3.org/2000/svg">
              <feGaussianBlur in="SourceGraphic" stdDeviation="${this.blurRadius}" />
            </filter>
            ${this.colors?.map(c => { 
              const color = c.pickedColor?c.pickedColor:c.default;
              return svg`
                <pattern 
                  id="img${color.patternYarn}" 
                  patternUnits="userSpaceOnUse" 
                  width="${this.imageScale}" 
                  height="${this.imageScale}" 
                  fill="var(--yarn${color.patternYarn})">
                <rect width="${this.imageScale}" height="${this.imageScale}" fill="${color.color}"></rect>
                ${this.yarnImage&&color.image
                  ?svg`<image href="${color.base64}" x="0" y="0" width="${this.imageScale}" height="${this.imageScale}" preserveAspectRatio="xMinYMin slice" filter="url(#f1)"/>`
                  :nothing
                }
              </pattern>
              `})}
          </defs>
        </svg>`}
      </div>

      <canvas id="canvas1" width="800" height="800" style="display:none"></canvas>
      <img id="canvastemp" style="display:none">
    `;
  }
  
  // TODO: tweak image position, scale, blur, toggle images of yarn, toggle image or color rectangles

  #changeBlurRadius(event: Event & { target: HTMLInputElement }):void {
    this.blurRadius = parseInt(event.target.value);
  }

  #changeYarnImage(event: Event & { target: HTMLInputElement }):void {
    this.yarnImage = event.target.checked;   
    this.colors = [...this.colors||[]];
  }

  #saveImage() {
    if(!this.patternCode) return;
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = 'none';
    
    const defs = this.renderRoot.querySelector('defs');
    const svg = this.renderRoot.querySelector('svg:first-of-type');
    const img = this.renderRoot.querySelector('#canvastemp') as HTMLImageElement;
    const canvas = this.renderRoot.querySelector('canvas');
    const filename = this.patternData?.name.replace(' ','-');

    if(!svg || !img || !canvas || !defs) return;

    svg?.append(defs.cloneNode(true));

    // get svg data
    var xml = new XMLSerializer().serializeToString(svg);

    // prepend a "header"
    var image64 = 'data:image/svg+xml;base64,' + btoa(xml);

    // set it as the source of the img element
    img.onload = function() {
      // draw the image onto the canvas
      if(canvas){
          canvas.getContext('2d')?.drawImage(img, 0, 0, 800, 800);
                
        var myImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.href = myImage;
        a.download = `${filename}.png`;
        a.click();
      }
    }
    img.src = image64;
      
  };

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
