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
  @property({type: Array}) colors?: PatternColor[];
  @property({type: Array}) pickedColors?: PickedColor[];

  /** Emits when the filter has been added or removed. */
  // The @event decorator is used to define a custom event that this component will emit.
  @event({name:'cp-set-working-yarn'}) setWorkingYarnEvent!: EventEmitter<CpSetWorkingYarnEvent>;

  @state() workingYarn?:string;

  render() {
    return html`
      ${this.colors?.map(pc=>{
        const color = pc.pickedColor ? pc.pickedColor : pc.default;
        //TODO find a better way to pass the folder
        return html`
          <sl-tag variant="primary">${pc.name}</sl-tag>
          <cp-color-card size="large" 
            ?selected=${this.workingYarn===pc.id} 
            .yarn=${{folder:color.yarnFolder} as Yarn}
            .palette=${color} 
            @click=${()=>this.selectWorkingColor(pc)}></cp-color-card>
          `})}`;
  }
  
  /**
   * Called when the element's properties change. 
   * If the 'colors' property changes and 'workingYarn' is not set, 
   * it sets 'workingYarn' to the first color's id.
   */
  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('colors')) {
      if(this.colors && !this.workingYarn){
        this.workingYarn = this.colors[0].id;
      }
    }
  }

  selectWorkingColor(color:PatternColor): void{
    this.workingYarn = color.id;
    this.setWorkingYarnEvent.emit(color.id);
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 8px 16px;
      align-items: center;
    }

    cp-color-card {
      cursor: pointer
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-pattern-colors': PatternColors;
  }
}
