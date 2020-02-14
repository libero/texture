import { NodeComponent } from '../../kit';
import { getLabel } from '../shared/nodeHelpers';

export default class KeywordComponent extends NodeComponent {
  render($$) {
    const keyword = this.props.node;
    const selected = this.props.selected;
    const Button = this.getComponent('button');
    //const label = getLabel(footnote) || '?';

    const el = $$('div')
      .addClass('sc-keyword')
      .attr('data-id', keyword.id);

    el.append(
      this._renderValue($$, 'name', { placeholder: this.getLabel('footnote-placeholder'), disabled: !selected }),
    );

    if (!selected) {
      el.addClass('sc-keyword-border');
      el.append(
        $$(Button, {
          icon: 'delete',
        })
          .addClass('se-remove-value')
          .on('click', this._onRemove),
      );
    }

    return el;
  }

  _onRemove() {
    this.send('removeKeyword', this.props.node);
  }
}
