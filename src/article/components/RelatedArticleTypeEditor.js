import DropdownEditor from '../shared/DropdownEditor';
import { JATS_LINK_TYPES } from "../ArticleConstants";

export default class RelatedArticleTypeEditor extends DropdownEditor {
  _getLabel() {
    return this.getLabel('relatedArticleType');
  }

  _getValues() {
    return JATS_LINK_TYPES;
  }
}
