import { CustomSurface } from 'substance';
import { NodeComponent } from '../../kit';
import { FontAwesomeIcon } from 'substance';
import { getLabel } from '../shared/nodeHelpers';

export default class AffiliationsListComponent extends CustomSurface {
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
    let el = $$('div').addClass('sc-affiliations-list');
    el.append(this._renderAffiliations($$));
    return el;
  }

  _renderAffiliations($$) {
    const sel = this.context.editorState.selection;
    const affiliations = this._getAffiliations();
    const Button = this.getComponent('button');

    let els = [];
    affiliations.forEach((affiliation, index) => {
      const affiliationEl = $$(AffiliationDisplay, { node: affiliation }).ref(affiliation.id);
      if (sel && sel.nodeId === affiliation.id) {
        affiliationEl.addClass('sm-selected');
      }
      els.push(affiliationEl);
    });

    els.push(
      $$(Button, {
        icon: 'insert',
        label: this.getLabel('add-affiliation')
      })
        .addClass('se-add-affiliation')
        .on('click', this._addAffiliation)
    );
    return els;
  }

  _getCustomResourceId() {
    return 'affiliations-list';
  }

  _getAffiliations() {
    return this.props.model.getItems();
  }

  _addAffiliation() {}
}

class AffiliationDisplay extends NodeComponent {
  render($$) {
    let el = $$('div').addClass('sc-affiliation');
    el.append(
      $$('div')
        .addClass('se-label')
        .append(this._getAffiliationLabel()),
      $$('div')
        .addClass('se-text')
        .append(this.props.node.toString()),
      $$(FontAwesomeIcon, { icon: 'fa-edit' }).addClass('se-icon')
    ).attr('data-id', this.props.node.id);

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

  _getAffiliationLabel() {
    return getLabel(this.props.node) || '?';
  }
}
