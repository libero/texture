import { NodeComponent } from "../../kit/ui";
import { METADATA_MODE } from "../ArticleConstants";
import DefaultNodeComponent from "./DefaultNodeComponent";
import ContributorIdentifierEditor from "../metadata/ContributorIdentifierEditor";

export class PersonComponent extends NodeComponent {
  render($$) {
    const mode = this.props.mode;
    const node = this.props.node;

    if (mode === METADATA_MODE) {
      return $$(PersonMetadataComponent, { node });
    }

    return super.render($$);
  }
}

class PersonMetadataComponent extends DefaultNodeComponent{
  _getPropertyEditorClass(name, value) {
    switch (name) {
      case 'contributorIds':
        return ContributorIdentifierEditor;

      default:
        return super._getPropertyEditorClass(name, value);
    }
  }
}
