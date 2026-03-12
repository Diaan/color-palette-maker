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
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Name</th>
            <th>Weight</th>
            <th>Colours</th>
          </tr>
        </thead>
        <tbody>
          ${this.yarns?.map(p => html`
            <tr @click=${() => this.selectYarn(p)} .yarn=${p}>
              <td>${p.company}</td>
              <td>${p.name}</td>
              <td>${p.weight}</td>
              <td><sl-badge>${p.colorAmount}</sl-badge></td>
            </tr>
          `)}
        </tbody>
      </table>
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
    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      text-align: left;
      padding: 8px;
      font-weight: 600;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    tbody td {
      padding: 8px;
      border-bottom: 1px solid var(--sl-color-neutral-100);
    }

    tr {
      cursor: pointer;
    }

    tr:hover {
      background: var(--sl-color-neutral-50);
    }

    sl-badge {
      --badge-background: var(--sl-color-primary-600);
      --badge-text-color: var(--sl-color-neutral-0);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-yarn-list': YarnList;
  }
}
