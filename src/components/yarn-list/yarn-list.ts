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
  @state() yarns?: YarnBase[];  

  @event({name:'cp-select-yarn'}) selectYarnEvent!: EventEmitter<CpSelectYarnEvent>;

  render() {
    return html`
      <ul>
      ${this.yarns?.map(p => html`<li  @click=${()=> this.selectYarn(p)} .yarn="${p}" >${p.company} - ${p.name}</li>`)}
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

  async _getYarns(): Promise<YarnBase[] | undefined> {
    try {
      const response = await fetch(`/yarns.json`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json = await response?.json();

      return json.yarns;
    } catch (error) {
      console.warn('error loading pattern');
      return;
    }
  }

  

  static styles = css`
    section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
    }
    
    li {
      cursor: pointer;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-yarn-list': YarnList;
  }
}
