import { AnnotationComponent } from '../../kit';

import {
  AbstractComponent,
  AcknowledgementComponent,
  AffiliationsListComponent,
  ArticleInformationComponent,
  AuthorsListComponent,
  AuthorDetailsListComponent,
  BlockFormulaComponent,
  BlockQuoteComponent,
  BoldComponent,
  BoxComponent,
  BreakComponent,
  MetadataFieldComponent,
  ExternalLinkComponent,
  FigureComponent,
  FigurePanelComponent,
  FootnoteComponent,
  HeadingComponent,
  InlineFormulaComponent,
  InlineGraphicComponent,
  ItalicComponent,
  JournalMetaComponent,
  KeywordsListComponent,
  ListComponent,
  ListItemComponent,
  ManuscriptComponent,
  ParagraphComponent,
  PermissionComponent,
  ReferenceComponent,
  ReferenceListComponent,
  RelatedArticlesListComponent,
  SectionLabel,
  SubjectsListComponent,
  SubscriptComponent,
  SuperscriptComponent,
  TableComponent,
  TableFigureComponent,
  UnsupportedInlineNodeComponent,
  XrefComponent,
  UnsupportedNodeComponent,
  GraphicComponent,
  SupplementaryFileComponent,
  DefaultNodeComponent,
  ModelPreviewComponent,
  PersonComponent,
} from '../components';

export default {
  name: 'manuscript-content',
  configure(config) {
    config.addComponent('abstract', AbstractComponent);
    config.addComponent('acknowledgement', AcknowledgementComponent);
    config.addComponent('affiliations-list', AffiliationsListComponent);
    config.addComponent('article-information', ArticleInformationComponent);
    config.addComponent('authors-list', AuthorsListComponent);
    config.addComponent('author-details-list', AuthorDetailsListComponent);
    config.addComponent('bold', BoldComponent);
    config.addComponent('box', BoxComponent);
    config.addComponent('block-formula', BlockFormulaComponent);
    config.addComponent('block-quote', BlockQuoteComponent);
    config.addComponent('break', BreakComponent);
    config.addComponent('metadata-field', MetadataFieldComponent);
    config.addComponent('external-link', ExternalLinkComponent);
    config.addComponent('figure', FigureComponent);
    config.addComponent('figure-panel', FigurePanelComponent);
    config.addComponent('footnote', FootnoteComponent);
    config.addComponent('heading', HeadingComponent);
    config.addComponent('inline-formula', InlineFormulaComponent);
    config.addComponent('inline-graphic', InlineGraphicComponent);
    config.addComponent('italic', ItalicComponent);
    config.addComponent('journal-meta', JournalMetaComponent);
    config.addComponent('keywords-list', KeywordsListComponent);
    config.addComponent('list', ListComponent);
    config.addComponent('list-item', ListItemComponent);
    config.addComponent('manuscript', ManuscriptComponent);
    config.addComponent('monospace', AnnotationComponent);
    config.addComponent('overline', AnnotationComponent);
    config.addComponent('paragraph', ParagraphComponent);
    config.addComponent('permission', PermissionComponent);
    config.addComponent('reference', ReferenceComponent);
    config.addComponent('person', PersonComponent);
    config.addComponent('reference-list', ReferenceListComponent);
    config.addComponent('related-articles-list', RelatedArticlesListComponent);
    config.addComponent('section-label', SectionLabel);
    config.addComponent('small-caps', AnnotationComponent);
    config.addComponent('strike-through', AnnotationComponent);
    config.addComponent('subjects-list', SubjectsListComponent);
    config.addComponent('subscript', SubscriptComponent);
    config.addComponent('superscript', SuperscriptComponent);
    config.addComponent('table', TableComponent);
    config.addComponent('table-figure', TableFigureComponent);
    config.addComponent('underline', AnnotationComponent);
    config.addComponent('unsupported-node', UnsupportedNodeComponent);
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent);
    config.addComponent('xref', XrefComponent);

    config.addComponent('graphic', GraphicComponent);
    config.addComponent('supplementary-file', SupplementaryFileComponent);

    // TODO: either we use DefaultNodeComponent generally, but with better control over the look-and-feel
    // or we use it only in Metadata Editor, or in popups.
    // binding to 'entity' sounds no appropriate anymore, because we do not have the concept of 'Entity' anymore
    config.addComponent('entity', DefaultNodeComponent);
    config.addComponent('model-preview', ModelPreviewComponent);

    config.addLabel('abstract-label', 'Abstract');
    config.addLabel('abstract-placeholder', 'Enter abstract');
    config.addLabel('acknowledgement-label', 'Acknowledgements');
    config.addLabel('acknowledgement-placeholder', 'Write any acknowledgements here');
    config.addLabel('affiliations-label', 'Affiliations');
    config.addLabel('add-affiliation', 'Add affiliation');
    config.addLabel('attribution-label', 'Attribution');
    config.addLabel('attribution-placeholder', 'Enter attribution');
    config.addLabel('authors-label', 'Authors');
    config.addLabel('body-label', 'Main text');
    config.addLabel('body-placeholder', 'Write your article here.');
    config.addLabel('caption-label', 'Caption');
    config.addLabel('caption-placeholder', 'Enter caption');
    config.addLabel('content-placeholder', 'Enter content');
    config.addLabel('file-upload-error', 'Something goes wrong');
    config.addLabel('file-upload-placeholder', 'Drag and drop or select item');
    // Note: we are registering a substring of other label to replace it with component
    config.addLabel('file-upload-select-placeholder', 'select');
    config.addLabel('footnote-placeholder', 'Enter footnote');
    config.addLabel('footnotes-label', 'Footnotes');
    config.addLabel('label-label', 'Label');
    config.addLabel('legend-label', 'Legend');
    config.addLabel('legend-placeholder', 'Enter legend');
    config.addLabel('metadata-label', 'Metadata');
    config.addLabel('references-label', 'References');
    config.addLabel('title-label', 'Title');
    config.addLabel('title-placeholder', 'Enter title');
    config.addLabel('subtitle-label', 'Subtitle');
    config.addLabel('subtitle-placeholder', 'Enter subtitle');
    config.addLabel('supplementary-file', 'Supplementary file');
    config.addLabel('supplementary-file-workflow-title', 'Add supplementary file');
    config.addLabel('supplementary-file-upload-label', 'Upload local file');
    config.addLabel('supplementary-file-link-label', 'Or use web link to downloadable file');
    config.addLabel('supplementary-file-link-placeholder', 'Enter url');

    // Used for rendering warning in case of missing images
    config.addIcon('graphic-load-error', { fontawesome: 'fa-warning' });
    config.addLabel('graphic-load-error', "We couldn't load an image, sorry.");

    // Box element labels
    config.addLabel('box-title-label', 'Box text');

    // Author details
    config.addLabel('author-details-label', 'Author Information');
    config.addLabel('author-details-correspendance', 'Corresponding author');

    // Article Information
    config.addLabel('article-information-label', 'Article Information');
    config.addLabel('article-information-subjects-label', 'Subjects');
    config.addLabel('article-information-type-label', 'Article Type');
    config.addLabel('article-information-keywords-label', 'Keywords');
    config.addLabel('article-information-research-organisms-label', 'Research Organisms');
    config.addLabel('article-information-doi-label', 'Article DOI');
    config.addLabel('article-information-elocation-id-label', 'eLocation ID');
    config.addLabel('article-information-year-label', 'Year');
    config.addLabel('article-information-volume-label', 'Volume');
    config.addLabel('article-information-publish-date-label', 'Publish date');
    config.addLabel('article-information-license-type-label', 'License Type');
    config.addLabel('article-information-license-statement-label', 'Copyright statement');
    config.addLabel('article-information-license-permissions-label', 'Permissions');

    // Keywords
    config.addLabel('author-generated', 'Keywords');
    config.addLabel('research-organism', 'Research organisms');

    // Subjects
    config.addLabel('select-subject', 'Select subject');
    config.addLabel('select-heading', 'Select type');
  },
};
