import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Yarn, YarnBase } from '../../models';
import { CpSelectYarnEvent, EventEmitter, event } from '../../events';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-yarn-list')
export class YarnList extends LitElement {
  @state() yarns?: Yarn[];  

  @event({name:'cp-select-yarn'}) selectYarnEvent!: EventEmitter<CpSelectYarnEvent>;

  render() {
    return html`
      <ul>
        ${this.yarns?.map(p => html`
          <li  @click=${()=> this.selectYarn(p)} .yarn="${p}" >
            ${p.company} - ${p.name} <sl-badge>${p.weight}</sl-badge>
          </li>`)}
      </ul>
    `;
  }

  selectYarn(yarn: YarnBase): void {
    this.selectYarnEvent.emit(yarn);
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this._getYarns().then((p) => {
      if (p) {
        this.yarns = p;
      }
    });
  }

  static getYarnInfo(id:string): Yarn | undefined {
    const yarns: Yarn[] = JSON.parse(localStorage.getItem('yarns')||'[]');
    return yarns?.find(yarn => yarn.folder === id);
  }

  async _getYarns(): Promise<Yarn[] | undefined> {
    try {
      const response = await fetch(`/yarns.json`);
       
      const json = await response?.json();
      localStorage.setItem(`yarns`, JSON.stringify(json.yarns));

      return json.yarns;
    } catch (error) {
      console.warn('error loading pattern');
      return;
    }
  }

  

  static styles = css`
    ul {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin:0;
      padding:0;
    }
    
    li {
      cursor: pointer;
      display: flex;
      list-style: none;

      sl-badge {
        margin-inline-start: auto;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-yarn-list': YarnList;
  }
}
