import { CustomSurface } from 'substance';
import { NodeComponent } from '../../kit';

export default class AuthorDetailsListComponent extends CustomSurface {
  getInitialState() {
    let items = this._getAuthors();
    return {
      hidden: items.length === 0,
      edit: false
    };
  }

  render($$) {
    let el = $$('div').addClass('sc-author-details-list');
    el.append(this._renderAuthors($$));
    return el;
  }

  _renderAuthors($$) {
    const authors = this._getAuthors();
    let els = [];
    authors.forEach((author, index) => {
      const authorEl = $$(AuthorDetailsDisplay, { node: author }).ref(author.id);
      els.push(authorEl);
    });
    return els;
  }

  _getCustomResourceId() {
    return 'author-details-list';
  }

  _getAuthors() {
    return this.props.model.getItems();
  }
}

class AuthorDetailsDisplay extends NodeComponent {
  render($$) {
    const author = this.props.node;
    const doc = author.document;

    let el = $$('div').addClass('se-author-details');
    el.append(
      $$('p')
        .addClass('se-author-details-fullname')
        .append(`${author.givenNames} ${author.surname}${author.corresp ? '*' : ''}`)
    );

    // Only display an email fir corresponding authors
    if (author.corresp && author.email) {
      el.append(
        $$('p')
          .addClass('se-author-details-correspondence')
          .append(`${this.getLabel('author-details-correspendance')}: `)
          .append(
            $$('a')
              .attr('href', `mailto:${author.email}`)
              .append(author.email)
          )
      );
    }

    // Render affliations in the format, <insitution> <dept> <city> <country>
    if (author.affiliations.length > 0) {
      author.affiliations.map(affiliationId => {
        const affiliationElement = doc.get(affiliationId);
        if (affiliationElement) {
          el.append(
            $$('p')
              .addClass('se-author-details-affilations')
              .append(affiliationElement.toString())
          );
        }
      });
    }

    if (author.contributorIds.length > 0) {
      author.contributorIds.map(contributorId => {
        const contributorIdElement = doc.get(contributorId);
        if (contributorIdElement && contributorIdElement.contribIdType === 'orcid') {
          // FIXME: Not 100% happy with the below solution, there is likely a better way to do this.
          const match = /0000-000(1-[5-9]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]/.exec(contributorIdElement.content);
          if (match) {
            el.append(
              $$('p')
                .addClass('se-author-details-orcid')
                .append(
                  $$('a')
                    .attr('href', match.input)
                    .append(match[0])
                )
            );
          } else {
            el.append(
              $$('p')
                .addClass('se-author-details-orcid')
                .append(
                  $$('a')
                    .attr('href', contributorIdElement.content)
                    .append(contributorIdElement.content)
                )
            );
          }
        }
      });
    }

    return el;
  }
}
