import { CollectionModel } from '../../kit/model';

export default class AuthorsSectionModel extends CollectionModel {
  constructor(api) {
    const path = ['metadata', 'authors'];
    const property = api.getDocument().getProperty(path);
    super(api, path, property);
  }

  get isCollection() {
    return true;
  }

  get type() {
    return 'authors-section';
  }

  get id() {
    return 'authors-section';
  }

}