import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { PatternColor } from '../../models/pattern';
import { CpSetWorkingYarnEvent, EventEmitter, event } from '../..';
import { PickedColor, Yarn } from '../../models';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-pattern-colors')
export class PatternColors extends LitElement {
  @property({type:Array}) colors?: PatternColor[];
  @property({type:Array}) pickedColors?: PickedColor[];

  /** Emits when the filter has been added or removed. */
  @event({name:'cp-set-working-yarn'}) setWorkingYarnEvent!: EventEmitter<CpSetWorkingYarnEvent>;

  @state() workingYarn?:string;

  render() {
    return html`
      <h2>Pattern colours:</h2>
      ${this.colors?.map(pc=>{
        const color = pc.pickedColor ? pc.pickedColor : pc.default;
        //TODO find a better way to pass the folder
        return html`
        <cp-color-card size="large" 
          ?selected=${this.workingYarn===pc.id} 
          .yarn=${{folder:color.yarnFolder} as Yarn}
          .palette=${color} 
          @click=${()=>this.selectWorkingColor(pc)}>${pc.name}:</cp-color-card>
          `})}`;
  }
  
  // .palette=${{color:color.color,name:pc.name, image: color.image}} 
  // {# style="--yarn-image: var(--yarn${pc.id}-image)" #}
  // override async updated(changes: PropertyValues<this>): Promise<void> {
  //   super.updated(changes);

  //   if (changes.has('colors')) {
  //     console.log(this.colors);
  //   }
  // }

  selectWorkingColor(color:PatternColor): void{
    this.workingYarn = color.id;
    this.setWorkingYarnEvent.emit(color.id);
  }

  static styles = css`
    :host {
      display:flex;
      flex-direction: column;
      gap: 5px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-colors': PatternColors;
  }
}
