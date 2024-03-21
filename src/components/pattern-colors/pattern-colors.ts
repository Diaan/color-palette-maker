import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PatternColor } from '../../models/pattern';
import { CpSetWorkingYarnEvent, EventEmitter, event } from '../..';
import { YarnColor } from '../../models';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-pattern-colors')
export class PatternColors extends LitElement {
  @property({type:Array}) patternColors?: PatternColor[];

  /** Emits when the filter has been added or removed. */
  @event({name:'cp-set-working-yarn'}) setWorkingYarnEvent!: EventEmitter<CpSetWorkingYarnEvent>;

  @state() workingYarn?:PatternColor;

  render() {
    return html`
      <h2>Pattern colours:</h2>
      ${this.patternColors?.map(pc=>html`
        <cp-color-card size="large" ?active=${this.workingYarn===pc} .palette=${{color:pc.default,name:pc.name}} @click=${()=>this.selectWorkingColor(pc)}>s</cp-color-card>
      `)}`;
  }

  static setColor(color:YarnColor): void{
    console.log('set color in patternColors', color);
  }

  selectWorkingColor(color:PatternColor): void{
    this.workingYarn = color;
    this.setWorkingYarnEvent.emit(color.id);
  }

  static styles = css`
    :host {
      display:flex;
      flex-direction: column;
      gap: 5px;
    }

    cp-color-card[active]{
      outline: 1px solid green;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-colors': PatternColors;
  }
}
