import { DocumentNode, STRING, BOOLEAN } from 'substance';

export default class ContributorIdentifier extends DocumentNode {
  render(options = {}) {
    return ''
  }
}

ContributorIdentifier.schema = {
  type: 'contributor-identifier',
  assigningAuthority: STRING,
  authenticated: BOOLEAN,
  contentType: STRING,
  contribIdType: STRING,
  id: STRING,
  specificUse: STRING,
  content: STRING,
};
