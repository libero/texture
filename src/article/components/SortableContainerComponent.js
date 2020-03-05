import { Component, domHelpers } from 'substance';

class SortableComponent extends Component {
  render($$) {
    return $$('div')
      .addClass('sc-sortable-item')
      .attr('draggable', true)
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
      .addClass('sortable-container')
      .on('dragstart', this._dragStart, this);

    const draggableChildren = this.props.children.map(child => {
      return $$(SortableComponent).append(child);
    });

    return sortableContainer.append(draggableChildren);
  }

  _dragStart(event) {
    const dragEl = event.target; // Remembering an element that will be moved

    // Limiting the movement type
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', dragEl.outerHTML);

    // Subscribing to the events at dnd
    // rootEl.addEventListener('dragover', _onDragOver, false);
    // rootEl.addEventListener('dragend', _onDragEnd, false);


    // setTimeout(function () {
    //   // If this action is performed without setTimeout, then
    //   // the moved object will be of this class.
    //   dragEl.classList.add('ghost');
    // }, 0)
  }
}
