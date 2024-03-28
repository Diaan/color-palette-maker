import { LitElement, PropertyValues, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cp-app')
export class App extends LitElement {
  @state() pattern?: string;
  
  url = new URL(window.location.href); // or construct from window.location
  params = new URLSearchParams(this.url.search.slice(1));

  render() {
    return this.pattern ? 
      html`<cp-palette-maker pattern-name=${this.pattern} @close=${this.close}></cp-palette-maker>`: 
      html`<cp-patterns @selectPattern=${this.selectPattern}></cp-patterns>`;
  }


  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    const param = this.params.get('pattern');
    if(!!param){
      this.pattern = param;
    }
  }

  close():void {
    this.pattern = undefined;
    this.params.delete('pattern');
    window.history.pushState({}, '');
  }

  selectPattern(event: CustomEvent):void {
    this.pattern = event.detail.folder;
    if(this.pattern){
      this.params.set('pattern', this.pattern);
      window.history.pushState({}, '', '/?' + this.params);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-app': App;
  }
}
