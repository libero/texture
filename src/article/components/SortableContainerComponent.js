import { Component } from 'substance';

class SortableComponent extends Component {
  render($$) {
    return $$('div')
      .addClass('sc-sortable-item')
      .attr('draggable', true)
      .attr('sort-index', this.props.sortIndex)
      .append($$('div').addClass('sc-sortable-item-handle'))
      .append(
        $$('div')
          .addClass('sc-sortable-item-content')
          .append(this.props.children),
      );
  }
}

export default class SortableContainerComponent extends Component {

  render($$) {
    const sortableContainer = $$('div')
      .addClass('sc-sortable-container')
      .on('dragstart', this._dragStart, this)
      .on('dragover', this._dragOver, this)
      .on('dragend', this._dragEnd, this);

    const draggableChildren = this.props.children.map((child, index) => {
      return $$(SortableComponent, {sortIndex: index}).append(child);
    });

    return sortableContainer.append(draggableChildren);
  }

  _dragStart(event) {
    this._dragOrigin = event.target; // Remembering an element that will be moved

    // Limiting the movement type
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.outerHTML);

    setTimeout(() => {
      // If this action is performed without setTimeout, then
      // the moved object will be of this class.
      event.target.classList.add('sc-draggable-shadow');
    }, 0);
  }

  _dragEnd(event) {
    event.preventDefault();
    this._dragOrigin.classList.remove('sc-draggable-shadow');
    const originalPosition = this._dragOrigin.getAttribute('sort-index');
    const newPosition = Array.from(this._dragOrigin.parentNode.children).indexOf(this._dragOrigin);

    if (originalPosition !== newPosition) {
      this.el.emit('rearrange', {from: parseInt(originalPosition), to: newPosition});
    }
  }

  // Function responsible for sorting
  _dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const sortableItem = this._getSortableItemFromDragOverTarget(event.target);

    if(!sortableItem) {
      return;
    }

    if (!sortableItem.classList.contains('sc-draggable-shadow')) {
      // Sorting
      const offset = this._getMouseOffset(event);
      const middleX = this._getElementVerticalCenter(event.target);

      const parentContainer = this._dragOrigin.parentNode;
      if (offset.x > middleX) {
        parentContainer.insertBefore(this._dragOrigin, sortableItem.nextSibling)
      } else {
        parentContainer.insertBefore(this._dragOrigin, sortableItem)
      }
    }
  }

  _getMouseOffset(event) {
    const targetRect = event.target.getBoundingClientRect();
    return {
      x: event.pageX - targetRect.left,
      y: event.pageY - targetRect.top
    }
  }

  _getSortableItemFromDragOverTarget(element) {
    if (element.classList.contains('sc-sortable-item')) {
      return element;
    }

    if (element.classList.contains('sc-sortable-container') || element.nodeName === 'BODY') {
      return null;
    }

    return this._getSortableItemFromDragOverTarget(element.parentNode);
  }

  _getElementVerticalCenter(el) {
    const rect = el.getBoundingClientRect();
    return (rect.right - rect.left) / 2
  }
}
