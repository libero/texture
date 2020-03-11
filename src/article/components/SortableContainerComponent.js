import { Component } from 'substance';
import autoScroll from 'dom-autoscroller';
import dragula from 'dragula';

class SortableComponent extends Component {
  render($$) {
    return $$('div')
      .addClass('sc-sortable-item')
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

  get direction () {
    return this.props.direction === SortableContainerComponent.HORIZONTAL
  }

  didMount() {
    super.didMount();
    const container = this.getScrollableContainer(this.el.el);

    this.drake = this.drake || dragula({
      containers: [this.el.el],
      revertOnSpill: true,
      mirrorContainer: this.el.el,
      accepts: function (el, target, source, sibling) {
        return target === source;
      },
      moves: function (el, container, handle) {
        return handle.classList.contains('sc-sortable-item-handle');
      },
      direction: this.direction,
    });

    this.drake.on('drop', this._dragEnd.bind(this));

    this.scroller = autoScroll([
      container
    ],{
      margin: 80,
      maxSpeed: 4,
      scrollWhenOutside: true,
      autoScroll: () => {
        // Only scroll when the pointer is down, and there is a child being dragged.
        return this.scroller.down && this.drake.dragging;
      }
    });
  }

  getScrollableContainer(container) {
    if (container.nodeName === 'HTML') {
      return null;
    }

    return container.clientHeight < container.scrollHeight
      ? container
      : this.getScrollableContainer(container.parentNode)
  }

  render($$) {
    const sortableContainer = $$('div').addClass('sc-sortable-container');

    const draggableChildren = this.props.children.map((child, index) => {
      return $$(SortableComponent, {sortIndex: index}).append(child);
    });

    return sortableContainer.append(draggableChildren);
  }

  _dragEnd(el, target, source, sibling) {
    const originalPosition = parseInt(el.getAttribute('sort-index'));

    const newPosition = sibling
      ? parseInt(sibling.getAttribute('sort-index'))
      : el.parentNode.children.length - 1;

    if (originalPosition !== newPosition) {
      this.el.emit('rearrange', {from: originalPosition, to: newPosition});
    }
  }
}

SortableContainerComponent.HORIZONTAL = 'horizontal';
SortableContainerComponent.VERTICAL = 'vertical';