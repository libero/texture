import { Component } from 'substance';
import addModelObserver from '../model/addModelObserver';
import removeModelObserver from '../model/removeModelObserver';

export default class ModelComponent extends Component {
  didMount() {
    addModelObserver(this.props.model, this.rerender, this);
  }

  dispose() {
    removeModelObserver(this);
  }

  // EXPERIMENTAL:
  // trying to avoid unnecessary rerenderings
  shouldRerender(newProps) {
    return newProps.model !== this.props.model;
  }
}
