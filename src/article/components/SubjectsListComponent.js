/* eslint-disable @typescript-eslint/no-use-before-define */
import { CustomSurface } from 'substance';
import { default as SubjectEditor } from './SubjectEditor';
import { createValueModel } from '../../kit/model/index';

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
    const api = this.context.api;
    const sel = this.context.editorState.selection;
    const subjects = this._getSubjects(this.props.type);
    const els = [];
    subjects.forEach(subject => {
      const model = createValueModel(api, [subject.id, 'name']);
      const subjectElement = $$(SubjectEditor, { model, subjectType: subject.groupType }).ref(subject.id);
      if (sel && sel.nodeId === subject.id) {
        subjectElement.addClass('sm-selected');
      }
      els.push(subjectElement);
    });
    return els;
  }

  _getCustomResourceId() {
    // FIXME: I'm not entirely sure that this is a decent solution, but it does the job for now.
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
