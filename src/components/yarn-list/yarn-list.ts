import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Pattern, YarnBase } from '../../models';
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
      <h2>Yarns:</h2>
      <section>
      ${this.yarns?.map(p => html`<cp-yarn-card  @click=${()=> this.selectYarn(p)} .yarn="${p}" >${p.name}</cp-yarn-card>`)}
      </section>
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

  async _getYarns(): Promise<Pattern[] | undefined> {
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
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-yarn-list': YarnList;
  }
}
