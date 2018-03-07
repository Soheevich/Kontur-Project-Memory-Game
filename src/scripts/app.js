/* eslint-env browser */

(function autorun() {
  'use strict';

  // HELPER FUNCTIONS

  // Function to create DOM element
  const createElement = (tag, attrs, ...children) => {
    const element = document.createElement(tag);

    Object.keys(attrs).forEach((key) => { element[key] = attrs[key]; });

    children.forEach((child) => {
      element.appendChild(child);
    });

    return element;
  };

  // Make an array of cards' filenames.
  // This's an unnecessary step. All these names could be added manually.
  const createCardFilenames = () => {
    const extension = '.svg';
    const array = [];
    const suites = ['c', 'd', 'h', 's'];
    suites.forEach((suite) => {
      for (let i = 1; i < 14; i += 1) {
        switch (i) {
          case 1:
            array.push(`1${suite}${extension}`);
            break;
          case 11:
            array.push(`j${suite}${extension}`);
            break;
          case 12:
            array.push(`q${suite}${extension}`);
            break;
          case 13:
            array.push(`k${suite}${extension}`);
            break;
          default:
            array.push(`${i}${suite}${extension}`);
            break;
        }
      }
    });

    return array;
  };

  const model = {};

  const view = {};

  const controller = {};
}());
