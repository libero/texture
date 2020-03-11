import { Component } from 'substance';
import autoScroll from 'dom-autoscroller';
import dragula from 'dragula';

const DEFAULT_HANDLE_CLASS = 'sc-sortable-item-handle';

class SortableComponent extends Component {
  render($$) {
    const el = $$('div')
      .addClass('sc-sortable-item')
      .attr('sort-index', this.props.sortIndex)

    if (this.props.useDefaultHandle) {
      el.append($$('div').addClass('sc-sortable-item-handle'));
    }

    el.append(
      $$('div')
        .addClass('sc-sortable-item-content')
        .append(this.props.children),
    );

    return el;
  }
}

export default class SortableContainerComponent extends Component {

  get _handleCssClass() {
    return this.props.handleCss || DEFAULT_HANDLE_CLASS;
  }

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
      accepts: (el, target, source) => {
        return target === source;
      },
      moves: (el, container, handle) => {
        return handle.classList.contains(this._handleCssClass);
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
      return $$(SortableComponent, {
        sortIndex: index,
        useDefaultHandle: !this.props.handleCss
      }).append(child);
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