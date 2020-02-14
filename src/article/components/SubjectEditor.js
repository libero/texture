import DropdownEditor from '../shared/DropdownEditor';
import { PREVIEW_MODE } from '../ArticleConstants';

const subjectTypes = [
  'Biochemistry and Chemical Biology',
  'Cancer Biology',
  'Cell Biology',
  'Chromosomes and Gene Expression',
  'Computational and Systems Biology',
  'Developmental Biology',
  'Ecology',
  'Epidemiology and Global Health',
  'Evolutionary Biology',
  'Genetics and Genomics',
  'Human Biology and Medicine',
  'Immunology and Inflammation',
  'Microbiology and Infectious Disease',
  'Neuroscience',
  'Physics of Living Systems',
  'Plant Biology',
  'Stem Cells and Regenerative Medicine',
  'Structural Biology and Molecular Biophysics',
];

const articleTypes = ['Insight', 'Research article', 'Tools and resources', 'Short report', 'Editorial'];

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
      values = subjectTypes.map(subjectType => {
        return {
          id: subjectType,
          name: subjectType,
        };
      });
    } else if (this.props.subjectType === 'heading') {
      values = articleTypes.map(articleType => {
        return {
          id: articleType,
          name: articleType,
        };
      });
    }
    return values;
  }
}
