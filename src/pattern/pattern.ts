import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export type Pattern = { name: string; file: string, colors: number };
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

  @state() patternCode?: string;

  render() {
    return html`
      <h3>${this.pattern?.name} (${this.pattern?.colors} colours)</h3>
      ${ unsafeHTML(this.patternCode)}`
  }
  static styles = css``;

  override async updated(changes: PropertyValues<this>): Promise<void> {
    super.updated(changes);

    if (changes.has('pattern') && this.pattern) {
      await this._getPattern(this.pattern).then((p) => {
        if (p) {
          this.patternCode = p;
        }
      });
    }
  }

  async _getPattern(pattern: Pattern): Promise<string | undefined> {
    try {
      const response = await fetch(`/patterns/${pattern.file}`);
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
