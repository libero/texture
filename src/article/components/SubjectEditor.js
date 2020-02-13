import DropdownEditor from '../shared/DropdownEditor';
import { domHelpers } from 'substance';

export default class SubjectEditor extends DropdownEditor {
  _getLabel() {
    return this.getLabel('select-subject');
  }

  _getValues() {
    return [
      {
        id: 'hello',
        name: 'hello',
      },
      {
        id: 'world',
        name: 'world',
      },
    ];
  }

  render($$) {
    const value = this.props.name;
    const el = $$('div').addClass(this._getClassNames());

    const dropdownSelector = $$('select')
      .ref('input')
      .addClass('se-select')
      .val(value)
      .on('click', domHelpers.stop)
      .on('change', this._setValue);

    dropdownSelector.append($$('option').append(this._getLabel()));

    this._getValues().forEach(l => {
      const option = $$('option')
        .attr({ value: l.id })
        .append(l.name);
      if (l.id === value) option.attr({ selected: 'selected' });
      dropdownSelector.append(option);
    });

    el.append(dropdownSelector);

    return el;
  }

  _getClassNames() {
    return 'sc-dropdown-editor';
  }

  _setValue() {
    const node = this.props.node;
    const input = this.refs.input;
    const value = input.getValue();

    // FIXME: This should create a transaction!
    node.name = value;
  }
}
