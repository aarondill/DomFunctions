Element.prototype.set = function CustomSet(...atrs) {
  let atrsObj = {};
  atrsObj = atrs[0] instanceof Object
      ? atrs[0] /*if obj, set to obj*/
      : atrs.reduce((obj, atr, i, valArr) =>(i % 2 === 0 &&valArr[i + 1] &&(obj[atr] = valArr[i + 1]) &&obj) || obj, {}); /*else make obj*/

  for (let atr in atrsObj) {
    let dots = atr.split("."), temp = this;
    for (let i = 0; i < dots.length - 1; i++) temp = temp[dots[i]];
    temp[dots.slice(-1)[0]] = atrsObj[atr]; /*set attrs*/
  }
  return this;
};

Element.prototype.setStyle = function CustomSetStyle(...atrs) {
  let atrsObj = {};
  atrsObj = atrs[0] instanceof Object
      ? atrs[0] /*if obj, set to obj*/
      : atrs.reduce((obj, atr, i, valArr) =>(i % 2 === 0 &&valArr[i + 1] &&(obj[atr] = valArr[i + 1]) &&obj) ||obj,{}); /*else make obj*/

  for (let atr in atrsObj) {
    let dots = atr.split("."), temp = this.style;
    for (let i = 0; i < dots.length - 1; i++) temp = temp[dots[i]];
    temp[dots.slice(-1)[0]] = atrsObj[atr]; /*set attrs*/
  }
  if (atrs.length % 2 == 1) this.style = atrs[atrs.length - 1]; /*odd?style = last*/
  return this;
};

Element.prototype.append = function append(...argArr) {
  let docFrag = document.createDocumentFragment();
  for (let argItem of argArr) docFrag.appendChild(argItem instanceof Node? argItem : document.createTextNode(String(argItem)));
  let r = [...docFrag.children];
  this.appendChild(docFrag);
  return r.length > 1 ? r : r[0];
};

var createElement = function CustomCreateElement(tag, append, appendType = "id", appendIndex = 0) {
  /*("Tag"||["Tag",...]), Element||"","id/class/name/tag/",#*/
  if (append === undefined) {
    let elems = [];
    for (tag of tag instanceof Array ? tag : [tag]) elems.push(document.createElement(tag));
    return elems.length > 1 ? elems : elems[0];
  }
  var isElement = (elem) => elem instanceof Element || elem instanceof HTMLDocument;
  if (!isElement(append) && typeof append == "string") {
    append = appendType === "id"
        ? document.getElementById(append)
        : appendType === "class"
        ? document.getElementsByClassName(append)[appendIndex]
        : appendType === "name"
        ? document.getElementsByName(append)[appendIndex]
        : appendType === "tag"
        ? document.getElementsByTagName(append)[appendIndex]
        : null;
  }
  if (!isElement(append)) console.warn(((e = new Error()), (e.name += ": No Element Found"), e.stack));
  let elems = [];
  for (tag of tag instanceof Array ? tag : [tag]) elems.push(append.appendChild(document.createElement(tag)));
  return elems.length > 1 ? elems : elems[0];
};

var elementFromText = function CustomElementFromText(str, antiScript = false) {
  if (str === undefined) console.error("elementFromText expected at least 1 argument, recieved 0");
  let doc = document.createElement("div");
  doc.innerHTML = str;
  let nodeScriptReplace = function (node) {
    if ((node.tagName === "SCRIPT") === true) {
      let script = document.createElement("script");
      script.text = node.innerHTML;
      let i = -1, attrs = node.attributes, attr;
      while (++i < attrs.length) script.setAttribute((attr = attrs[i]).name, attr.value);
      node.parentNode.replaceChild(script, node);
    } else {
      let i = -1, children = node.childNodes;
      while (++i < children.length) nodeScriptReplace(children[i]);
    }
    return node;
  };
  let r = antiScript ? [...doc.children] : [...nodeScriptReplace(doc).children];
  return r.length > 1 ? r : r[0];
};

var createSelect = function CustomCreateSelect(append, fields) {
  //append, [opts] || append, ...opts || [opts] || ...opts
  let args, sel;
  if (append instanceof Element) {
    sel = createElement("select", append);
    if (Array.isArray(fields)) args = fields;
    else args = [...arguments].slice(1);
  } else {
    sel = createElement("select");
    if (Array.isArray(append)) args = append;
    else args = [...arguments];
  }
  for (let arg of args) createElement("option", sel).innerText = arg;
  return sel
};

var elementToText = function CustomElementToText(elem) {
  let serial = new XMLSerializer().serializeToString(elem);
  let withoutNS = serial.replace(' xmlns="http://www.w3.org/1999/xhtml"', "");
  return withoutNS === elem.outerHTML ? withoutNS : serial;
};
