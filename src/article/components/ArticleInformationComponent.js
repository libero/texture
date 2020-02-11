import { CustomSurface, FontAwesomeIcon } from 'substance';

export default class ArticleInformationComponent extends CustomSurface {
  getInitialState() {
    return {
      hidden: false,
      edit: false, // TODO: Check if this effects children of the control or not!
    };
  }

  render($$) {
    const el = $$('div').addClass('sc-article-information');

    // Components
    const SubjectsListComponent = this.getComponent('subjects-list');
    const SectionLabel = this.getComponent('section-label');

    // Models
    const subjectsModel = this.props.model.getSubjects();

    // Subjects
    el.append($$(SectionLabel, { label: this.getLabel('article-information-subjects-label') }));
    el.append(
      $$(SubjectsListComponent, {
        model: subjectsModel,
        type: 'subject',
      }).addClass('sm-subjects-list'),
    );

    // Keywords By Group

    // Research Organisms

    // Article Type
    el.append($$(SectionLabel, { label: this.getLabel('article-information-type-label') }));
    el.append(
      $$(SubjectsListComponent, {
        model: subjectsModel,
        type: 'heading',
      }).addClass('sm-subjects-list'),
    );

    return el;
  }

  _renderAuthors($$) {
    const authors = this._getAuthors();
    const els = [];
    authors.forEach((author, index) => {
      const authorEl = $$(AuthorDetailsDisplay, { node: author }).ref(author.id);
      els.push(authorEl);
    });
    return els;
  }

  _getCustomResourceId() {
    return 'article-information';
  }
}

// class AuthorDetailsDisplay extends NodeComponent {
//   render($$) {
//     const author = this.props.node;
//     const doc = author.document;

//     let el = $$('div').addClass('se-author-details');
//     el.append(
//       $$('p')
//         .addClass('se-author-details-fullname')
//         .append(`${author.givenNames} ${author.surname}`),
//     );

//     // Only display an email fir corresponding authors
//     if (author.email) {
//       el.append(
//         $$('p')
//           .addClass('se-author-details-correspondence')
//           .append(author.corresp ? `${this.getLabel('author-details-correspendance')}: ` : '')
//           .append(
//             $$('a')
//               .attr('href', `mailto:${author.email}`)
//               .append(author.email),
//           ),
//       );
//     }

//     // Render affliations in the format, <insitution> <dept> <city> <country>
//     if (author.affiliations.length > 0) {
//       author.affiliations.map(affiliationId => {
//         const affiliationElement = doc.get(affiliationId);
//         if (affiliationElement) {
//           el.append(
//             $$('p')
//               .addClass('se-author-details-affilations')
//               .append(affiliationElement.toString()),
//           );
//         }
//       });
//     }

//     if (author.contributorIds.length > 0) {
//       author.contributorIds.map(contributorId => {
//         const orcidIdElement = $$('div').addClass('se-author-details-orchid');
//         const contributorIdElement = doc.get(contributorId);
//         if (contributorIdElement && contributorIdElement.contribIdType === 'orcid') {
//           if (contributorIdElement.authenticated) {
//             orcidIdElement.append($$(FontAwesomeIcon, { icon: 'fa-circle' }).addClass('se-icon'));
//           }
//           // FIXME: Not 100% happy with the below solution, there is likely a better way to do this.
//           const match = /0000-000(1-[5-9]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]/.exec(contributorIdElement.content);
//           if (match) {
//             orcidIdElement.append(
//               $$('p')
//                 .addClass('se-author-details-orcid')
//                 .append(
//                   $$('a')
//                     .attr('href', match.input)
//                     .append(match[0]),
//                 ),
//             );
//           } else {
//             orcidIdElement.append(
//               $$('p')
//                 .addClass('se-author-details-orcid')
//                 .append(
//                   $$('a')
//                     .attr('href', contributorIdElement.content)
//                     .append(contributorIdElement.content),
//                 ),
//             );
//           }
//         }
//         el.append(orcidIdElement);
//       });
//     }

//     if (author.competingInterests.length > 0) {
//       author.competingInterests.map(id => {
//         const element = doc.get(id);
//         if (element) {
//           el.append($$(FootnoteComponent, { node: element, mode: CONTENT_MODE }));
//         }
//       });
//     }

//     return el;
//   }
// }
