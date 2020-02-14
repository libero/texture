import DropdownEditor from '../shared/DropdownEditor';
import { ARTICLE_SUBJECTS, ARTICLE_TYPES } from '../ArticleConstants';

export default class SubjectEditor extends DropdownEditor {
  _getLabel() {
    let label = 'Select';
    if (this.props.subjectType === 'subject') {
      label = this.getLabel('select-subject');
    } else if (this.props.subjectType === 'heading') {
      label = this.getLabel('select-heading');
    }
    return label;
  }

  _getValues() {
    let values = [];
    if (this.props.subjectType === 'subject') {
      values = ARTICLE_SUBJECTS.map(subjectType => {
        return {
          id: subjectType,
          name: subjectType,
        };
      });
    } else if (this.props.subjectType === 'heading') {
      values = ARTICLE_TYPES.map(articleType => {
        return {
          id: articleType,
          name: articleType,
        };
      });
    }
    return values;
  }
}
