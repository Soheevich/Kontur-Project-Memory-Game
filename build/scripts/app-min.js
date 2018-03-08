/* eslint-env browser */

(function autorun() {
  /* =================
  MODEL
  ================== */
  const model = (function modelAutorun() {
    const deck = [];
    let cardNames;
    let randomCards = [];

    return {
      init() {
        cardNames = this.createCardNamesArray();
        cardNames.forEach((cardName) => {
          const title = cardName.split('-').join(' of ');
          const srcset = this.createCardFilenames(cardName);
          const temporaryCard = this.createCard(cardName, title, srcset);

          deck.push(temporaryCard);
        });
      },

      reset() {
        randomCards = null;
      },

      getDeck() {
        return deck;
      },

      getRandomPairs() {
        return randomCards;
      },

      createCard(id, title, srcset) {
        return { id, title, srcset };
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

      createCardFilenames(inputName) {
        const outputFilename = `build/images/${inputName}.svg`;
        return outputFilename;
      },

      makeRandomNumber(max) {
        return Math.floor(Math.random() * (max + 1));
      },

      makeRandomPairs(number) {
        const totalPairs = number * 2;
        const tempArray = [];

        while (tempArray.length < totalPairs) {
          const tempRandomCardIndex = this.makeRandomNumber(53);

          if (!tempArray.includes(tempRandomCardIndex)) {
            tempArray.push(tempRandomCardIndex, tempRandomCardIndex);
          }
        }

        for (let i = tempArray.length - 1; i > 0; i -= 1) {
          const j = this.makeRandomNumber(i);
          const temp = tempArray[i];
          tempArray[i] = tempArray[j];
          tempArray[j] = temp;
        }

        tempArray.forEach((cardIndex) => {
          randomCards.push(deck[cardIndex]);
        });
      },
    };
  }());

  /* =================
  VIEW
  ================== */
  const view = (function viewAutorun() {
    const mainBoard = document.querySelector('.main__board');

    return {
      init() {
        const img = this.createElement('img', {
          className: 'main__start-image',
          src: 'images/StartGame.png',
        });
        const title = this.createElement(
          'h1',
          { className: 'main__title' },
          'memory game',
        );
        const button = this.createElement(
          'button',
          { className: 'main__new-game' },
          'Начать игру',
        );
        const article = this.createElement(
          'article',
          { className: 'main__start-screen' },
          img,
          title,
          button,
        );

        button.addEventListener('click', controller.newGame);

        mainBoard.appendChild(article);
      },

      createElement(tag, attrs, ...children) {
        const element = document.createElement(tag);

        Object.keys(attrs).forEach((key) => {
          element[key] = attrs[key];
        });

        children.forEach((child) => {
          let tempChild = child;
          if (typeof tempChild === 'string') {
            tempChild = document.createTextNode(child);
          }
          element.appendChild(tempChild);
        });

        return element;
      },

      newGame() {
        const startScreen = document.querySelector('.main__start-screen');

        startScreen.remove();
      },
    };
  }());

  /* =================
  CONTROLLER
  ================== */
  const controller = (function controllerAutorun() {
    // ============
    // Total number of shown pairs of cards can be changed
    // Remember to change main.scss => .main__board => grid size
    // ============
    const numberOfPairs = 9;

    return {
      init() {
        model.init();
        view.init();
      },

      newGame() {
        model.makeRandomPairs(numberOfPairs);
        // console.log(model.getRandomPairs(numberOfPairs));

        view.newGame();
      },
    };
  }());
  controller.init();
  // controller.newGame();
}());
