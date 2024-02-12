import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export type Pattern = { name: string; folder: string};
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-pattern')
export class MyPattern extends LitElement {
  @property({type: Object})
  pattern?: Pattern;

  @property({attribute:'defs', type: Object})
  defs?:any;

  @state() patternCode?: string;

  render() {
    return this.pattern ? 
      html`
        <h3>${this.pattern?.name}</h3>
        ${ unsafeHTML(this.patternCode)}
        <div></div>
      ` : html`
        <p>Please choose a pattern above</p>
        <p>Patterns marked with 🧶 support images of the yarn, the rest work only with solid colours</p>
      `;
      
  }
  static styles = css``;

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('pattern') && this.pattern) {
      await this._getPatternInfo(this.pattern).then((p) => {
        if (p) {
          this.patternCode = p;
        }
      });
    }

    if (changes.has('defs') || changes.has('pattern') && this.defs && this.pattern) {
      const svgContainer = this.renderRoot.querySelector('div');
      if(svgContainer){
        svgContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
          ${this.defs.map((def:{url:string, index:string}) => 
            `<pattern id="img${def.index}" patternUnits="userSpaceOnUse" width="100" height="100" fill="var(--yarn${def.index})">
              <rect  width="100" height="100" fill="var(--yarn${def.index})" />
              <image href="${def.url}" x="0" y="0" width="130" height="100" preserveAspectRatio="xMinYMin slice"/>
            </pattern>
            `).join('\n')}
          </defs>
        </svg>`;
      }
    }
  }

  async _getPatternInfo(pattern: Pattern): Promise<string | undefined> {
    try {
      const response = await fetch(`/patterns/${pattern.folder}/pattern.html`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const html = await response.text();
      return html;
    } catch (error) {
      console.warn('error loading pattern');
      return;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-pattern': MyPattern;
  }
}
