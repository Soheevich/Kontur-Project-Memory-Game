/* eslint-env browser */

const createElement = (fragment, tag, attrs, ...children) => {
  const element = document.createElement(tag);

  Object.keys(attrs).forEach((key) => { element[key] = attrs[key]; });

  children.forEach((child) => {
    element.appendChild(child);
  });

  return element;
};

export default createElement;
