/* eslint-disable @typescript-eslint/no-use-before-define */
import { CustomSurface } from 'substance';
import { NodeComponent } from '../../kit';
import { getLabel } from '../shared/nodeHelpers';
import SortableContainerComponent from './SortableContainerComponent';

export default class AuthorsListComponent extends CustomSurface {
  getInitialState() {
    const items = this._getAuthors();
    return {
      hidden: items.length === 0,
      edit: false,
    };
  }

  didMount() {
    super.didMount();
    const appState = this.context.editorState;
    // FIXME: it is not good to rerender on every selection change.
    // Instead it should derive a state from the selection, and only rerender if the
    // state has changed (not-selected, selected + author id)
    appState.addObserver(['selection'], this.rerender, this, { stage: 'render' });
  }

  dispose() {
    super.dispose();
    this.context.editorState.removeObserver(this);
  }

  render($$) {
    const Button = this.getComponent('button');
    const el = $$('div').addClass('sc-authors-list-container');
    const editButton = $$(Button, { icon: 'edit-section' })
      .addClass('se-edit-button')
      .on('click', this._openEditDialog, this);

    const list = $$(SortableContainerComponent, {
      direction: SortableContainerComponent.HORIZONTAL
    })
      .addClass('sc-authors-list')
      .on('rearrange', this._onListRearranged, this)
      .append(this._renderAuthors($$));

    const addAuthorButton = $$(Button, {
      icon: 'insert',
      label: this.getLabel('add-author'),
    })
      .addClass('se-add-author')
      .on('click', this._addAuthor);

    const spacer = $$('div').addClass('spacer');

    el.append([list, addAuthorButton, spacer, editButton]);
    return el;
  }

  _renderAuthors($$) {
    const sel = this.context.editorState.selection;
    const authors = this._getAuthors();
    const els = [];
    authors.forEach(author => {
      const authorEl = $$(AuthorDisplay, { node: author }).ref(author.id);
      if (sel && sel.nodeId === author.id) {
        authorEl.addClass('sm-selected');
      }
      els.push(authorEl);
    });
    return els;
  }

  _onListRearranged(event) {
    const {from, to} = event.detail;
    const nodeIds = this.props.model.getValue();

    this.context.api._moveEntity(nodeIds[from], to - from);
  }

  _addAuthor() {
    this.send('executeCommand', 'add-author');
  }

  _getCustomResourceId() {
    return 'authors-list';
  }

  _getAuthors() {
    return this.props.model.getItems();
  }

  _openEditDialog() {
    if (!this._isAuthorSelected()) {
      const firstAuthor = this._getAuthors()[0];
      this.context.api.selectEntity(firstAuthor.id);
    }
    this.send('executeCommand', 'edit-author');
  }

  _isAuthorSelected() {
    const selectedNode = this.context.editorState.selectionState.node;
    if (selectedNode) {
      return selectedNode
        .getXpath()
        .toArray()
        .some(x => x.property === 'authors');
    }
  }
}

class AuthorDisplay extends NodeComponent {
  render($$) {
    const person = this.props.node;
    const el = $$('span').addClass('se-contrib');
    el.append(this.context.api.renderEntity(person));
    if (person.affiliations.length > 0) {
      el.append($$('sup').append(getLabel(person)));
    }

    el.on('mousedown', this._onMousedown).on('click', this._onClick);
    return el;
  }

  _onMousedown(e) {
    e.stopPropagation();
    if (e.button === 2) {
      this._select();
    }
  }

  _onClick(e) {
    e.stopPropagation();
    this._select();
  }

  _select() {
    this.context.api.selectEntity(this.props.node.id);
  }
}
