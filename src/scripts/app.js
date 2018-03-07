/* eslint-env browser */

(function autorun() {
  'use strict';

  // Make an array of cards' filenames.
  // This's an unnecessary step. All these names could be added manually.
  const createCardFilenames = () => {
    const extension = '.svg';
  };

  const model = (function modelAutorun() {
    return {
      createCard(id, title, scrset) {
        return {
          id,
          title,
          scrset,
        };
      },

      createCardNamesArray() {
        return (function idArray() {
          const array = [];
          const suites = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
          suites.forEach((suite) => {
            for (let i = 1; i < 14; i += 1) {
              switch (i) {
                case 1:
                  array.push(`Ace-${suite}`);
                  break;
                case 11:
                  array.push(`Jack-${suite}`);
                  break;
                case 12:
                  array.push(`Queen-${suite}`);
                  break;
                case 13:
                  array.push(`King-${suite}`);
                  break;
                default:
                  array.push(`${i}-${suite}`);
                  break;
              }
            }
          });

          return array;
        }());
      },
    };
  }());

  const view = (function viewAutorun() {
    return {
      createElement(tag, attrs, ...children) {
        const element = document.createElement(tag);

        Object.keys(attrs).forEach((key) => {
          element[key] = attrs[key];
        });

        children.forEach((child) => {
          element.appendChild(child);
        });

        return element;
      },
    };
  }());

  const controller = (function controllerAutorun() {
    // ============
    // Total number of shown pairs of cards can be easily changed
    // Remember to change main.scss => .main__board => grid size
    // ============
    const numberOfPairs = 9;

    return {};
  }());
}());
