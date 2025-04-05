import { LitElement, PropertyValues, css, html, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Pattern, PatternColor } from '../../models/pattern';
import { ifDefined } from 'lit/directives/if-defined.js';
import { getBase64FromImageUrl } from '../../util/image';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-pattern-viewer')
export class PatternViewer extends LitElement {

  @property({attribute: 'pattern-name'}) patternName!: string;

  @state() imageScale:number = 150;
  @state() crop:number = 10;
  @state() blurRadius:number = 0;
  @state() enrichedColors?: PatternColor[];
  @property({type:Boolean}) yarnImage:boolean = true;

  @property({attribute: 'pattern-code'}) patternCode?: string;
  @property({ attribute: 'pattern-data', type:Object}) patternData?: Pattern;
  @property({type:Array}) colors?: PatternColor[];

  render() {
    return html`
      <header>
        <h1>${this.patternData?.name}</h1>
        <span>by <a href=${ifDefined(this.patternData?.url)} target="_blank">${this.patternData?.designer}</a></span>
      </header>
     
      <cp-pattern-colors .colors=${this.colors}></cp-pattern-colors>
      ${ unsafeHTML(this.patternCode)}
  
      <sl-button @click=${this.#saveImage}>Dowload image</sl-button>
      <sl-divider></sl-divider>
      <sl-switch ?checked=${this.yarnImage} @sl-change=${this.#changeYarnImage} class="label-on-left">Show yarn image</sl-switch>
      <sl-range min="0" max="50" step="1" value=${this.blurRadius} @sl-change=${this.#changeBlurRadius} label="Blur yarn image" class="label-on-left"></sl-range>
      <sl-range min="1" max="10" step="1" value=${this.crop} @sl-change=${this.#changeCrop} label="Crop" class="label-on-left"></sl-range>
      <sl-range min="50" max="250" step="10" value=${this.imageScale} @sl-change=${this.#changeImageScale} label="Image scale" class="label-on-left"></sl-range>
      <canvas id="canvas1" width="800" height="800" style="display:none" ></canvas>
      <img id="canvastemp" style="display:none">
      <div class="svg-defs">
        ${svg`<svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f1" x="0" y="0" xmlns="http://www.w3.org/2000/svg">
              <feGaussianBlur in="SourceGraphic" stdDeviation="${this.blurRadius}" edgeMode="wrap"/>
            </filter>
            
            ${this.enrichedColors?.map(c => { 
              const color = c.pickedColor?c.pickedColor:c.default;
              const x = this.imageScale/2;
              const y = this.imageScale/2;
              const crop = 2-this.crop/10;
              return svg`
                <pattern 
                  id="img${color.patternYarn}" 
                  patternUnits="userSpaceOnUse" 
                  width="${this.imageScale}" 
                  height="${this.imageScale}">
                <rect 
                  x=${x - (this.imageScale*crop)/2} 
                  y=${y - (this.imageScale*crop)/2} 
                  width="${this.imageScale*crop}"  
                  height="${this.imageScale*crop}" 
                  fill="${color.color}"></rect>
                ${this.yarnImage&&color.image
                  ?svg`<image 
                        href="${c.base64}" 
                        x=${x - (this.imageScale*crop)/2 - this.blurRadius*2} 
                        y=${y - (this.imageScale*crop)/2 - this.blurRadius*2} 
                        width="${(this.imageScale*crop)+this.blurRadius*4}" 
                        height="${(this.imageScale*crop)+this.blurRadius*4}" 
                        preserveAspectRatio="xMidYMid slice" 
                        filter="url(#f1)"/>`
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

    if (changes.has('colors') && this.colors) {
      this.enrichedColors = await Promise.all(this.colors.map(async c => {
        const color = c.pickedColor?c.pickedColor:c.default;
        if(!color?.image) return c;
        const base64 = await getBase64FromImageUrl(color.image);
        if(!base64) return c;
        return {...c, base64};
      }));
    }
  }
  // TODO: tweak image position, scale, blur, toggle images of yarn, toggle image or color rectangles

  #changeBlurRadius(event: Event & { target: HTMLInputElement }):void {
    this.blurRadius = parseInt(event.target.value);
  }

  #changeCrop(event: Event & { target: HTMLInputElement }):void {
    this.crop = parseInt(event.target.value);
  }

  #changeImageScale(event: Event & { target: HTMLInputElement }):void {
    this.imageScale = parseInt(event.target.value);
  }

  #changeYarnImage(event: Event & { target: HTMLInputElement }):void {
    this.yarnImage = event.target.checked;   
    this.colors = [...this.colors||[]];
  }

  #saveImage() {
    if(!this.patternCode) return;
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = 'none';
    
    //TODO: don't use base 64 for svg shown on page, only use it for downloaded svg. for performance reasons.
    const defs = this.renderRoot.querySelector('defs');
    const svg = this.renderRoot.querySelector('svg:first-of-type');
    const img = this.renderRoot.querySelector('#canvastemp') as HTMLImageElement;
    const canvas = this.renderRoot.querySelector('canvas');
    const filename = this.patternData?.name.replace(' ','-');

    if(!svg || !img || !canvas || !defs) return;
    
    
    const downloadableSvg = svg.cloneNode(true) as SVGElement;
    downloadableSvg?.append(defs.cloneNode(true));
    
    let height = parseInt(downloadableSvg.getAttribute('viewBox')?.split(' ')[3]||'0');
    const width = parseInt(downloadableSvg.getAttribute('viewBox')?.split(' ')[2]||'0');

    const xmlns = "http://www.w3.org/2000/svg";

    const style = document.createElementNS(xmlns,'style');
    style.textContent = `.svg-text {
      font: normal 18px sans-serif;
      color: #000;
    }`;
    downloadableSvg.append(style);

    this.enrichedColors?.forEach((c,i) => { 
      const color = c.pickedColor?c.pickedColor:c.default;
      const y = 50 * (i+1);

      const text = document.createElementNS(xmlns,'text');
      text.setAttribute('x','80');
      text.setAttribute('y',`${height+y}`);
      text.setAttribute('class','svg-text');
      text.textContent = `${color.patternYarn}: ${color.name} (${color.yarnFolder})`;
      downloadableSvg.append(text);

      const rect = document.createElementNS(xmlns,'rect');
      rect.setAttribute('width','40');
      rect.setAttribute('height','40');
      rect.setAttribute('x','20');
      rect.setAttribute('y',`${height+y - 30}`);
      rect.setAttribute('fill',`url(#img${c.id})`);
      downloadableSvg.append(rect);
    });
    
    height+= 50 * ((this.enrichedColors?.length||0)+1);
        
    canvas.width = width;
    canvas.height = height;
    
    downloadableSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const xml = new XMLSerializer().serializeToString(downloadableSvg);

    // prepend a "header"
    const image64 = 'data:image/svg+xml;base64,' +window.btoa(xml);

    // set it as the source of the img element
    img.onload = function() {
      // draw the image onto the canvas
      if(canvas){
          canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                
        const myImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
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
    header {
      display: flex;
      align-items: center;
      gap: 20px;
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
