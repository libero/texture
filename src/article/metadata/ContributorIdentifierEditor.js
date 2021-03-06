import { Component, domHelpers } from "substance";
import { createNodePropertyModels, createValueModel } from "../../kit/model";
import DefaultNodeComponent from "../components/DefaultNodeComponent";
import { ValueComponent } from "../../kit/ui";

export default class ContributorIdentifierEditor extends ValueComponent {

  dispose() {
    this.context.editorState.removeObserver(this);
  }

  render($$) {
    const node = this.props.model.getItems()[0];
    const nodeId = node.id;
    const el = $$('div')
      .addClass(this._getClassNames())
      .attr('data-id', nodeId);

    el.append($$(ContributorIDEditorComponent, { node }).ref(node.id));

    el.on('click', this._onClick);
    return el;
  }

  _getClassNames() {
    return 'sc-card sm-contributor-id';
  }

  _onClick(e) {
    domHelpers.stopAndPrevent(e);
  }
}

class ContributorIDEditorComponent extends DefaultNodeComponent {
  _getClassNames() {
    return 'sc-reference sm-metadata';
  }

  _getPropertyEditorProps(name, value) {
    const props = super._getPropertyEditorProps(name, value);
    if (name === 'authenticated') {
      props.disabled = true;
    }
    return props;
  }
}
