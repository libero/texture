import { Component } from 'substance';
import CardComponent from './CardComponent';
import { METADATA_MODE } from '../ArticleConstants';
import PersonComponent from '../components/PersonComponent';
import SortableContainerComponent from '../components/SortableContainerComponent';

export default class AuthorsSectionComponent extends Component {
  render($$) {
    const model = this.props.model;
    let items = model.getItems();
    let el = $$(SortableContainerComponent, {direction: SortableContainerComponent.VERTICAL})
      .addClass('sc-authors-collection-editor')
      .on('rearrange', this._onListRearranged, this);

    const cardEls = items.map(person => {
      return this._renderCardComponent($$, person);
    });

    return el.append(cardEls);
  }

  _onListRearranged(event) {
    const {from, to} = event.detail;
    const nodeIds = this.props.model.getValue();

    this.context.api._moveEntity(nodeIds[from], to - from);
  }

  _renderCardComponent($$, person) {
    return $$(CardComponent, {
      node: person,
      label: person.type,
    }).append(this._renderPersonComponentEl($$, person));
  }

  _renderPersonComponentEl($$, person) {
    return $$(PersonComponent, {
      node: person,
      mode: METADATA_MODE,
    }).ref(person.id)
  }
}
