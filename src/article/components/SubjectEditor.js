import DropdownEditor from '../shared/DropdownEditor';

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
      values = [
        {
          id: 'Chromosomes and Gene Expression',
          name: 'Chromosomes and Gene Expression',
        },
        {
          id: 'Genetics and Genomics',
          name: 'Genetics and Genomics',
        },
      ];
    } else if (this.props.subjectType === 'heading') {
      values = [
        {
          id: 'Insight',
          name: 'Insight',
        },
      ];
    }
    return values;
  }
}
