import { createNodePropertyModels, createValueModel } from '../../kit';
import DefaultNodeComponent from '../components/DefaultNodeComponent';
import LicenseEditor from '../components/LicenseEditor';

export default class ArticleMetadataComponent extends DefaultNodeComponent {
  _getClassNames() {
    return `sc-article-record`;
  }

  _renderHeader() {
    // no header
  }

  _getPropertyEditorClass(name, value) {
    switch (name) {
      case 'license': {
        return LicenseEditor;
      }
      default:
        return super._getPropertyEditorClass(name, value);
    }
  }

  _createPropertyModels() {
    const EXCLUDED_FIELDS = new Set([
      'authors',
      'editors',
      'groups',
      'affiliations',
      'funders',
      'keywords',
      'subjects',
      'articleType',
      'issn',
      'publisherName'
    ]);
    const api = this.context.api;
    const node = this.props.node;
    const doc = node.getDocument();
    return createNodePropertyModels(api, this.props.node, p => {
      switch (p.name) {
        case 'permission': {
          let permission = doc.get(node.permission);
          return createNodePropertyModels(api, permission);
        }
        default:
          if (!EXCLUDED_FIELDS.has(p.name)) {
            return createValueModel(api, [node.id, p.name], p);
          }
      }
    });
  }
}
