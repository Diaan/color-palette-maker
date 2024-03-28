import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { YarnColor } from '../../models';

let id = 0;
function uuid() {
  return new Date().getTime() + '' + id++;
}

class DraggableList extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('drop', this.drop);
  }

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap:8px;
    }`;

  drop(e:DragEvent) {
    // @ts-ignore
    e.target.classList.remove('over');

    const id = e.dataTransfer?.getData('text/plain');
    const draggable = this.querySelector(`[draggable-id="${id}"]`);
    const movingItem = (draggable as DraggableItem).data;
    const insertBefore = (e.target as DraggableItem).data;
    
    const all = this.querySelectorAll('draggable-item');
    const dataArray = Array.from(all).map(item => (item as DraggableItem).data).filter(item => item.name !== movingItem.name);
    dataArray.splice(dataArray.indexOf(insertBefore),0,movingItem);
    // @ts-ignore
    this.emitOrder(dataArray);
  }

  render() {
    return html`<slot></slot>`;
  }

  emitOrder(order: YarnColor[]): void {
    const options = {
      detail: order,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('updateOrder', options));
  }
  
}

export class DraggableItem extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
    }

    :host(.over) {
      border-top: 2px dashed lightgrey;
      border-radius: 5px;
      opacity: 0.6; 
    }

    :host(.draggable) {
      user-select: none;
      cursor: move;
    }

    .draggable-marker {
      font-size: 18px;
      font-weight: bold;
      cursor: move;
    }
    .draggable-content {
      flex: 1;
      pointer-events: none;
    }

    :host(.dragging) {
      background-color: #ffff;
      opacity: 1;
    } 

    .remove { cursor: default;}

    `;

  id = uuid();

  @property() data: any;

  #onSlotChange() {
    this.addEventListener('dragstart', this.dragStart);
    this.addEventListener('dragenter', this.dragEnter);
    this.addEventListener('dragover', this.dragOver);
    this.addEventListener('dragleave', this.dragLeave);
    this.addEventListener('dragend', this.dragEnd);

    this.setAttribute('draggable-id', this.id);

    this.classList.add('draggable');

    this.setAttribute('draggable', 'true');
  }

  dragStart(e:DragEvent) {
    e.dataTransfer?.setData('text/plain', this.id);
    if(e.dataTransfer){
      e.dataTransfer.effectAllowed = 'move';
    }
    this.classList.add('dragging');
  }

  dragEnter(e:DragEvent) {
    e.preventDefault();

    // @ts-ignore
    e.target.classList.add('over');
  }

  dragOver(e:DragEvent) {
    e.preventDefault();
    // @ts-ignore
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  dragLeave(e:DragEvent) {
    e.stopPropagation();
    // @ts-ignore
    e.target.classList.remove('over');
  }

  dragEnd(e:DragEvent) {
    this.style.opacity = '1';
    // @ts-ignore
    e.target.classList.remove('over');
    this.classList.remove('dragging');
  }

  removeItem(e:MouseEvent): void {
    e.stopPropagation();
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('removeItem', options));
  }

  render() {
    return html`
    <div class="draggable-marker">::</div>
    <div class="draggable-content">
      <slot @slotchange=${this.#onSlotChange}></slot>
    </div>
    <div class="remove" @click=${this.removeItem}>x</div>
    `;
  }
}

customElements.define('draggable-item', DraggableItem);
customElements.define('draggable-list', DraggableList);
