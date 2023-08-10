import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-pattern-hilma')
export class MyPatternHilma extends LitElement {
  render() {
    return html`
      <div class="part1" style="--height: 1"></div>
      <div class="part2" style="--height: 2"></div>
      <div class="part1" style="--height: 1"></div>
      <div class="part3" style="--height: 4"></div>
      <div class="part4" style="--height: 2"></div>
      <div class="part5" style="--height: 2"></div>
      <div class="part6" style="--height: 1.5"></div>
      <div class="part1" style="--height: 10"></div>
      <div class="part2" style="--height: 4"></div>
      <div class="part5" style="--height: 1.5"></div>
      <div class="part4" style="--height: 2"></div>
      <div class="part3" style="--height: 3"></div>
      <div class="part7" style="--height: 2"></div>
    `;
  }
  static styles = css`
    :host {
      --stripe-width: 1.5vh;
    }
    div {
      --height: 1;
      height: calc(var(--height) * var(--stripe-width));
      background: repeating-linear-gradient(
        to right,
        var(--stripe1),
        var(--stripe1) var(--stripe-width),
        var(--stripe2) var(--stripe-width),
        var(--stripe2) calc(var(--stripe-width)*2)
      );
    }
    
    .part1{
      --stripe1: var(--yarnA);
      --stripe2: var(--yarnB);
    }
    
    .part2{
      --stripe1: var(--yarnA);
      --stripe2: var(--yarnC);
    }
    
    .part3{
      --stripe1: var(--yarnE);
      --stripe2: var(--yarnD);
    }
    .part4{
      --stripe1: var(--yarnE);
      --stripe2: var(--yarnA);
    }
    
    .part5{
      --stripe1: var(--yarnD);
      --stripe2: var(--yarnC);
    }
    
    .part6{
      --stripe1: var(--yarnA);
      --stripe2: var(--yarnC);
    }
    
    .part7{
      --stripe1: var(--yarnB);
      --stripe2: var(--yarnD);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-pattern-hilma': MyPatternHilma;
  }
}
