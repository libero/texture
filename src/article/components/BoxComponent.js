import { NodeComponent } from '../../kit';

export default class BoxComponent extends NodeComponent {
  render($$) {
    const node = this.props.node;

    const Button = this.getComponent('button');
    const SectionLabel = this.getComponent('section-label');

    // Card
    const el = $$('div')
      .addClass('sc-box')
      .attr('data-id', node.id);

    const titleEl = $$('div').addClass('sc-title');

    // Label
    titleEl.append($$(SectionLabel, { label: 'box-title-label' }));

    // Remove Button
    titleEl.append(
      $$(Button, {
        icon: 'trash',
      })
        .addClass('se-remove-value')
        .on('click', this._onRemove),
    );

    el.append(titleEl);

    // Content
    el.append(this._renderValue($$, 'content', { placeholder: this.getLabel('content-placeholder') }));
    return el;
  }

  _onRemove() {
    this.send('removeBox', this.props.node);
  }
}
