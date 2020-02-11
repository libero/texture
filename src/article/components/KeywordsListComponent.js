/* eslint-disable @typescript-eslint/no-use-before-define */
import { CustomSurface } from 'substance';
import { NodeComponent } from '../../kit';
import { getLabel } from '../shared/nodeHelpers';

export default class KeywordsListComponent extends CustomSurface {
  getInitialState() {
    const items = this._getKeywords();
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
    const el = $$('div').addClass('sc-keywords-list');
    el.append(this._renderKeywords($$));
    return el;
  }

  _renderKeywords($$) {
    const sel = this.context.editorState.selection;
    const keywords = this._getKeywords(this.props.type);
    const els = [];
    keywords.forEach(keyword => {
      const keywordElement = $$(KeywordDisplay, { node: keyword }).ref(keyword.id);
      if (sel && sel.nodeId === keyword.id) {
        keywordElement.addClass('sm-selected');
      }
      els.push(keywordElement);
    });
    return els;
  }

  _getCustomResourceId() {
    // FIXME: This seems like a hack to me, need to take a deeper look at this.
    return 'subjects-list-' + (this.props.type || 'default');
  }

  _getKeywords(type) {
    let keywords = this.props.model.getItems();
    if (type) {
      keywords = keywords.filter(keyword => keyword.groupType === type);
    }
    return keywords;
  }
}

class KeywordDisplay extends NodeComponent {
  render($$) {
    const keyword = this.props.node;
    // FIXME: Need a better CSS class here
    const el = $$('span').addClass('se-contrib');
    el.append(this.context.api.renderEntity(keyword));
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
