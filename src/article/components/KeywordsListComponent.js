/* eslint-disable @typescript-eslint/no-use-before-define */
import { CustomSurface } from 'substance';
import { NodeComponent } from '../../kit';
import { getLabel } from '../shared/nodeHelpers';
import KeywordComponent from './KeywordComponent';

export default class KeywordsListComponent extends CustomSurface {
  getActionHandlers() {
    return {
      removeKeyword: this._removeKeyword,
    };
  }

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
      const selected = sel && sel.path && sel.path[0] === keyword.id ? true : false;
      const keywordElement = $$(KeywordComponent, { node: keyword, selected }).ref(keyword.id);
      // TODO: This should be handled maybe in the sub component
      if (selected) {
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

  _removeKeyword(keyword) {
    this.props.model.removeItem(keyword);
  }
}
