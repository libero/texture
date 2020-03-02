import { findChild, findAllChildren, retainChildren } from '../util/domHelpers';
import { getLabel } from '../../shared/nodeHelpers';
import { MetadataField } from '../../nodes';

export default class FigurePanelConverter {
  get type() {
    return 'figure-panel';
  }

  // ATTENTION: figure-panel is represented in JATS
  // instead there is the distinction between fig-group and fig
  // which are represented as Figure in Texture
  get tagName() {
    return 'fig';
  }

  import(el, node, importer) {
    const $$ = el.createElement.bind(el.getOwnerDocument());
    const labelEl = findChild(el, 'label');
    const contentEl = this._getContent(el);
    const permissionsEl = findAllChildren(el, 'permissions');
    let captionEl = findChild(el, 'caption');
    const doc = importer.getDocument();
    // Preparations
    if (!captionEl) {
      captionEl = $$('caption');
    }
    let titleEl = findChild(captionEl, 'title');
    if (!titleEl) {
      titleEl = $$('title');
    }
    // drop everything than 'p' from caption
    retainChildren(captionEl, 'p');
    // there must be at least one paragraph
    if (!captionEl.find('p')) {
      captionEl.append($$('p'));
    }
    // EXPERIMENTAL: supporting <supplementary-material> in figure caption
    // in JATS this requires a HACK, wrapping <supplementary-material> into a <p>
    // this implementation is prototypal, i.e. has not been signed off commonly
    this._unwrapDisplayElements(captionEl);

    // Conversion
    if (labelEl) {
      node.label = labelEl.text();
    }
    node.title = importer.annotatedText(titleEl, [node.id, 'title']);
    // content is optional
    // TODO: really?
    if (contentEl) {
      node.content = importer.convertElement(contentEl).id;
    }
    // Note: we are transforming capton content to legend property
    node.legend = captionEl.children.map(child => importer.convertElement(child).id);

    // Get all the permissions elements, create new 'Permission' nodes and pack their ids into an array.
    node.permissions = [];
    if (permissionsEl.length > 0) {
      for (const element of permissionsEl) {
        node.permissions.push(importer.convertElement(element).id);
      }
    }

    // Custom Metadata Fields
    const kwdGroupEls = el.findAll('kwd-group');
    node.metadata = kwdGroupEls.map(kwdGroupEl => {
      const kwdEls = kwdGroupEl.findAll('kwd');
      const labelEl = kwdGroupEl.find('label');
      const name = labelEl ? labelEl.textContent : '';
      const value = kwdEls.map(kwdEl => kwdEl.textContent).join(', ');
      return doc.create({
        type: MetadataField.type,
        name,
        value,
      }).id;
    });

    // Attribution
    const attributionEl = findChild(el, 'attrib');
    if (attributionEl) {
      node.attribution = importer.annotatedText(attributionEl, [node.id, 'attribution']);
    }
  }

  _getContent(el) {
    return findChild(el, 'graphic');
  }

  export(node, el, exporter) {
    const $$ = exporter.$$;
    // ATTENTION: this helper retrieves the label from the state
    const label = getLabel(node);
    if (label) {
      el.append($$('label').text(label));
    }
    // Attention: <title> is part of the <caption>
    // Note: we are transforming the content of legend to <caption>
    if (node.title || node.legend) {
      const content = node.resolve('legend');
      let captionEl = $$('caption');
      if (content.length > 0) {
        captionEl.append(content.map(p => exporter.convertNode(p)));
      }
      if (node.title) {
        // Note: this would happen if title is set, but no caption
        if (!captionEl) captionEl = $$('caption');
        // ATTENTION: wrapping display elements into a <p>
        // Do this before injecting the title
        this._wrapDisplayElements(captionEl);
        captionEl.insertAt(0, $$('title').append(exporter.annotatedText([node.id, 'title'])));
      }
      el.append(captionEl);
    }

    // Attribution
    if (node.attribution) {
      $$('attrib').append(exporter.annotatedText([node.id, 'attribution']));
    }

    // Custom Metadata Fields
    if (node.metadata.length > 0) {
      const kwdGroupEls = node.resolve('metadata').map(field => {
        const kwdGroupEl = $$('kwd-group').append($$('label').text(field.name));
        const kwdEls = field.value.split(',').map(str => {
          return $$('kwd').text(str.trim());
        });
        kwdGroupEl.append(kwdEls);
        return kwdGroupEl;
      });
      el.append(kwdGroupEls);
    }
    if (node.content) {
      el.append(exporter.convertNode(node.resolve('content')));
    }

    // TODO: This needs to be tested to ensure that the permissions are exported correctly as children of the 'fig'
    //       element and not packed into a container of sorts.
    const permissions = node.resolve('permissions');
    if (permissions.length > 0) {
      for (const permission of permissions) {
        el.append(exporter.convertNode(permission));
      }
    }
  }

  // EXPERIMENTAL see comment above
  _unwrapDisplayElements(el) {
    const children = el.getChildren();
    const L = children.length;
    for (let i = L - 1; i >= 0; i--) {
      const child = children[i];
      if (child.is('p[specific-use="display-element-wrapper"]')) {
        const children = child.getChildren();
        if (children.length === 1) {
          el.replaceChild(child, children[0]);
        } else {
          console.error('Expecting a single element wrapped in <p>');
        }
      }
    }
  }

  _wrapDisplayElements(el) {
    const children = el.getChildren();
    const L = children.length;
    for (let i = L - 1; i >= 0; i--) {
      const child = children[i];
      if (!child.is('p')) {
        const p = el
          .createElement('p')
          .attr('specific-use', 'display-element-wrapper')
          .append(child.clone(true));
        el.replaceChild(child, p);
      }
    }
  }
}
