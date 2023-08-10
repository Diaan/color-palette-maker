import { LitElement, css, html } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';

@customElement('my-sortable-list')
export class MySortableList extends LitElement {
  /** The slotted checkboxes. */
  @queryAssignedElements() items?: HTMLElement[];

  keys = ['A','B','C','D','E','F','G','H','I','J'];
  dragSrcEl?: HTMLElement;
  possibleTarget?: number;

  render() {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  #onSlotchange(): void {
    if(this.items){
      this.items.forEach(item=>{
        const index = item ? this.items?.indexOf(item) : 0;
        item.setAttribute('data-index', (index||0).toString(10));
        item.draggable = true;
        item.addEventListener('drop', this.handleDrop);
        item.addEventListener('dragstart', this.handleDragStart);
        item.addEventListener('dragend', this.handleDragEnd);
        item.addEventListener('dragenter', this.handleDragEnter);
        item.addEventListener('dragleave', this.handleDragLeave);
      })
    }
  }

  handleDragStart(e:DragEvent){
    this.style.opacity = '0.4';

    this.dragSrcEl = this;
    
  }

  handleDragEnd(e:DragEvent){
    this.style.opacity = '1';
    this.dragSrcEl = undefined;
    console.log(
      this.getAttribute('data-index'),
      this.possibleTarget
    )
  }

  handleDragEnter() {
    this.classList.add('over');
    const index = this ? this.items?.indexOf(this) : 0;
    this.possibleTarget = index;
    console.log(this.possibleTarget)
  }

  handleDragLeave() {
    this.classList.remove('over');
  }

  handleDrop(e:DragEvent) {
    console.log('drop',e.currentTarget);
    // e.stopPropagation(); // stops the browser from redirecting.

    if (this.dragSrcEl && this.dragSrcEl !== this && e.currentTarget) {
      this.dragSrcEl.innerHTML = this.innerHTML;
      // .innerHTML = e.dataTransfer?.getData('text/html');
    }
  
    return false;
  }

  static styles = css`
    slot{
      border: 1px solid gold;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    ::slotted(*){
       cursor: move;
    }

    ::slotted(*.over){
      border: 3px dotted #666;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-sortable-list': MySortableList;
  }
}


