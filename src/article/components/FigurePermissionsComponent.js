import { ValueComponent } from '../../kit';

export default class FigurePermissionsComponent extends ValueComponent {
  getActionHandlers() {
    return {
      removePermission: this._removePermission,
    };
  }

  render($$) {
    const items = this.props.model.getItems();
    const Button = this.getComponent('button');
    const el = $$('div').addClass('sc-permissions');

    if (items.length > 0) {
      el.append(items.map(field => this._renderPermissionCard($$, field)));
    }

    el.append(
      $$(Button, {
        icon: 'insert',
        label: this.getLabel('add-license'),
      })
        .addClass('se-add-value')
        .on('click', this._addPermission),
    );
    return el;
  }

  _renderPermissionCard($$, node) {
    const PermissionComponent = this.getComponent(node.type);
    const el = $$('div')
      .addClass('sc-card')
      .attr('data-id', node.id)
      .append(
        $$('div')
          .addClass('se-label')
          .append('License'),
      )
      .append($$(PermissionComponent, { node }).ref(node.id));
    return el;
  }

  _addPermission() {
    this.props.model.addItem({ type: 'permission' });
  }

  _removePermission(permission) {
    this.props.model.removeItem(permission);
  }
}
