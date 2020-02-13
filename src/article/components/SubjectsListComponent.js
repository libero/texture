/* eslint-disable @typescript-eslint/no-use-before-define */
import { CustomSurface } from 'substance';
import { NodeComponent } from '../../kit';
import { default as SubjectEditor } from './SubjectEditor';
import { getLabel } from '../shared/nodeHelpers';

export default class SubjectsListComponent extends CustomSurface {
  getInitialState() {
    const items = this._getSubjects();
    return {
      hidden: items.length === 0,
      edit: false,
    };
  }

  didMount() {
    super.didMount();

    const appState = this.context.editorState;
    // FIXME: it is not good to rerender on every selection change.
    // Instead it should derive a state from the selection, and only rerender if the
    // state has changed (not-selected, selected + author id)
    appState.addObserver(['selection'], this.rerender, this, { stage: 'render' });
  }

  dispose() {
    super.dispose();
    this.context.editorState.removeObserver(this);
  }

  render($$) {
    const el = $$('div').addClass('sc-subjects-list');
    el.append(this._renderSubjects($$));
    return el;
  }

  _renderSubjects($$) {
    const sel = this.context.editorState.selection;
    const subjects = this._getSubjects(this.props.type);
    const els = [];
    subjects.forEach((subject, index) => {
      const subjectElement = $$(SubjectEditor, { node: subject }).ref(subject.id);
      if (sel && sel.nodeId === subject.id) {
        subjectElement.addClass('sm-selected');
      }
      els.push(subjectElement);
    });
    return els;
  }

  _getCustomResourceId() {
    // FIXME: This seems like a hack to me, need to take a deeper look at this.
    return 'subjects-list-' + (this.props.type || 'default');
  }

  _getSubjects(type) {
    let subjects = this.props.model.getItems();
    if (type) {
      subjects = subjects.filter(subject => subject.groupType === type);
    }
    return subjects;
  }
}

class SubjectDisplay extends NodeComponent {
  render($$) {
    const subject = this.props.node;
    // FIXME: Need a better CSS class here
    const el = $$('span').addClass('se-contrib');
    el.append(this.context.api.renderEntity(subject));
    el.on('mousedown', this._onMousedown).on('click', this._onClick);
    return el;
  }

  _onMousedown(e) {
    e.stopPropagation();
    if (e.button === 2) {
      this._select();
    }
  }

  _onClick(e) {
    e.stopPropagation();
    this._select();
  }

  _select() {
    this.context.api.selectEntity(this.props.node.id);
  }
}
