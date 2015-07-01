import _ from 'lodash';
import {EventEmitter} from 'events';

window.makeComponent = function makeComponent(componentName, prototype) {
  const importDoc = document.currentScript.ownerDocument;
  const proto = Object.create(HTMLElement.prototype);

  _.assign(proto, EventEmitter.prototype);
  _.assign(proto, {
    cloneTemplate(tplName) {
      const tpl = this.getTemplateNode(tplName);
      if (!tpl) {
        return null;
      }
      return importDoc.importNode(tpl.content, true);
    },
    getTemplateNode(tplName) {
      this.templates = this.templates || {};
      if (!tplName) {
        return this.getTemplateBySelector(this.templates[this.mainTemplate] || this.mainTemplate || 'template');
      }
      if (!this.templates[tplName]) {
        throw new Error(`No template named "${tplName}" found in ${this.constructor.name}`);
      }
      return this.getTemplateBySelector(this.templates[tplName]);
    },
    getTemplateBySelector(selector) {
      if (!selector) {
        throw new Error(`No template found; no selector passed`);
      }
      return importDoc.querySelector(selector);
    },
    getTemplate(tplName) {
      const tplNode = this.getTemplateNode(tplName);
      const tpl = mkTpl(tplNode.innerHTML);
      return function (content) {
        const clone = importDoc.createElement(tplNode.getAttribute('tag-name')||'div');
        clone.innerHTML = tpl(content);
        clone.setAttribute('class', tplNode.getAttribute('classes'));
        return clone;
      };
    }
  });
  _.assign(proto, prototype);
  if (!prototype.initialize) {
    prototype.initialize = function () {};
  }

  proto.createdCallback = function () {
    const shadow = this.createShadowRoot();
    const contentNode = this.cloneTemplate();
    if (contentNode) shadow.appendChild(contentNode);
    this.initialize();
  };

  return document.registerElement(componentName, {
    prototype: proto
  });

  function mkTpl(tplStr) {
    const opts = {};

    opts.escape = /{{[-]([\s\S]+?)}}/g;
    opts.evaluate = /{{{([\s\S]+?)}}}/g;
    opts.interpolate = /{{(?=[^{/])([\s\S]+?)}}/g;

    return _.template(tplStr, opts);
  }
};

export default makeComponent;
