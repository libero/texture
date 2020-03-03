/* eslint-disable @typescript-eslint/no-use-before-define */
import { CustomSurface } from 'substance';
import { createValueModel, FormRowComponent, NodeComponent } from '../../kit';
import { default as RelatedArticleTypeEditor } from './RelatedArticleTypeEditor';

export default class RelatedArticleListComponent extends CustomSurface {
  getInitialState() {
    const items = this._getRelatedArticles();
    return {
      hidden: items.length === 0,
      edit: false,
    };
  }

  getActionHandlers() {
    return {
      removeRelatedArticle: this._removeRelatedArticle,
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
    const el = $$('div').addClass('sc-related-articles-list');
    el.append(this._renderRelatedArticles($$));
    return el;
  }

  _renderRelatedArticles($$) {
    const sel = this.context.editorState.selection;
    const relatedArticles = this._getRelatedArticles();
    const els = [];
    relatedArticles.forEach((relatedArticle, index) => {
      const relatedArticleEl = $$(RelatedArticleComponent, { node: relatedArticle }).ref(relatedArticle.id);
      if (sel && sel.nodeId === relatedArticle.id) {
        relatedArticleEl.addClass('sm-selected');
      }
      els.push(relatedArticleEl);
    });
    return els;
  }

  _getCustomResourceId() {
    return 'related-articles-list';
  }

  _getRelatedArticles() {
    return this.props.model.getItems();
  }

  _addRelatedArticle() {
    this.props.model.addItem({ type: 'related-article' });
  }

  _removeRelatedArticle(relatedArticle) {
    this.props.model.removeItem(relatedArticle);
  }
}

class RelatedArticleComponent extends NodeComponent {
  render($$) {
    const node = this.props.node;

    const Button = this.getComponent('button');

    // Card
    const el = $$('div')
      .addClass('sc-card')
      .attr('data-id', node.id)
      .append(
        $$('div')
          .addClass('se-label')
          .append(this.getLabel('relatedArticleItemTitle')),
      );

    el.append(
      $$('div')
        .addClass('sc-header')
        .append(
          $$(Button, {
            icon: 'trash',
          })
            .addClass('se-button')
            .on('click', this._onRemove),
        ),
    );

    const relatedArticleTypeModel = createValueModel(this.context.api, [node.id, 'relatedArticleType']);

    el.append(
      $$('div')
        .addClass('sc-related-article')
        .append(
          $$(FormRowComponent, { label: this.getLabel('relatedArticleHref') })
            .attr('data-id', node.id)
            .addClass('sm-related-article')
            .append(
              this._renderValue($$, 'href', {
                placeholder: this.getLabel('relatedArticleHrefPlaceholder'),
              }).addClass('sm-name'),
            ),
        )
        .append(
          $$(FormRowComponent, { label: this.getLabel('relatedArticleType') })
            .attr('data-id', node.id)
            .addClass('sm-related-article')
            .append($$(RelatedArticleTypeEditor, { model: relatedArticleTypeModel })),
        ),
    );

    return el;
  }

  _onRemove() {
    this.send('removeRelatedArticle', this.props.node);
  }
}
