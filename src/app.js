import { aiprompt } from './app-shared.js';

async function createAppCard(ttl, dsc) {
  const appCard = await miro.board.createAppCard({
    title: ttl,
    description: dsc,
    style: {
      cardTheme: '#2d9bf0',
    },
    fields: [
      /*
            {
              value: 'Tasks',
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/3176/3176366.png',
              iconShape: 'square',
              fillColor: '#bef2f2',
              textColor: '#0713FF',
              tooltip: 'Caption text displayed in a tooltip when clicking or hovering over the preview field',
            },
            */
      {
        value: 'AI Actions',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3867/3867669.png',
        iconShape: 'square',
        fillColor: '#dddddd',
        textColor: '#000000',
        tooltip: 'Not initialized',
      },
    ],
    x: 0,
    y: 0,
    width: 320,
    rotation: 0.0,
    status: 'connected', // Default status of new app cards: 'disconnected'
  });

  return appCard;
}
async function linkCards(card1, card2, caption) {
  // Create a connector.
  const connector = await miro.board.createConnector({
    shape: 'elbowed',
    style: {
      startStrokeCap: 'none',
      endStrokeCap: 'stealth',
      strokeStyle: 'normal',
      strokeColor: '#000',
      strokeWidth: 2,
    },
    // Set the start point of the connector.
    start: {
      // Define the start board item for the connector by specifying the 'start' item ID.
      item: card1.id,
      // Set a point on the border of the 'start' shape to mark the start point of the connector.
      position: {
        // Horizontal: right
        x: 1.0,
        // Vertical: middle
        y: 0.5,
      },
    },
    // Set the end point of the connector.
    end: {
      // Define the end board item for the connector by specifying the 'end' item ID.
      item: card2.id,
      // Set a snapTo of 'end' shape to mark the end point of the connector.
      snapTo: 'right',
    },
    captions: [
      {
        content: caption,
        position: 0.5,
        textAlignVertical: 'bottom',
      },
    ],
  });
}

document.getElementById('initBasicScenario').addEventListener(
  "click", function () { initBasicScenario(); });
document.getElementById('initCompareScenario').addEventListener(
  "click", function () { initCompareScenario(); });
document.getElementById('beginCompare').addEventListener(
  "click", function () { beginCompare(); });


async function clearBoard(typ = 'app_card') {
  miro.board.get({
    type: [typ]
  }).then(
    (items) => {
      items.forEach(item => miro.board.remove(item))
    }
  );
}

async function initBasicScenario() {
  clearBoard()
  var card = createAppCard(
    'The sales tax feature',
    'The shopping cart tax module needs to collect the correct local tax for the buyer\'s location and the taxability of the items in the cart.'
  );

}

var featCard, pbiCard, docCard;
async function initCompareScenario() {
  clearBoard()
  featCard = await createAppCard(
    'Sales tax feature',
    'The shopping cart tax module needs to collect the correct local tax for the buyer\'s location and the taxability of the items in the cart.'
  );
  featCard.x -= 100;
  featCard.sync();

  pbiCard = await createAppCard(
    'Postal code lookup',
    'As a customer, I want to see and confirm that the sales tax percentage is appropriate for my municipality. As a business owner, ' +
    'I want to remit the taxes to local authorities according to their regulations.\nThis must use the postal code to look up the right tax.\nThe tax must ' +
    'come from the Avalera data provider based on the postal code\nThe shopping cart must not permit checkout without a valid tax from Avalera'
  );
  pbiCard.y = 200;
  pbiCard.sync();

  docCard = await createAppCard(
    'Application High Level Design',
    'The roles in the system are customer and business owner.'
  );
  docCard.y = 400;
  docCard.sync();

  await linkCards(featCard, pbiCard);
  await linkCards(featCard, docCard);
}
async function beginCompare() {
  clearBoard('sticky_note') 

  await aiprompt(
    "Compare the following two blocks of text and report the top 3 most important differences between them in under 100 words. The first block of text should be a feature, and the second box should be details of how it is built:\n" +
    featCard.title + ". " + featCard.description + "\n\n" + pbiCard.title + ". " + pbiCard.description,
    false,
    (x) => {
      var aiResult = x.choices[0].message.content;

      console.log(aiResult);

      const stickyNote = miro.board.createStickyNote({
        content: aiResult,
        style: {
          fillColor: 'light_yellow', // Default value: light yellow
          textAlign: 'center', // Default alignment: center
          textAlignVertical: 'middle', // Default alignment: middle
        },
        x: 400, // Default value: horizontal center of the board
        y: 100, // Default value: vertical center of the board
        shape: 'square',
        width: 200, // Set either 'width', or 'height'
      });
    }
  );

}

// Listen to the 'app_card:open' event
miro.board.ui.on('app_card:open', (event) => {
  //console.log('Subscribed to app card open event', event);
  const { appCard } = event;
  //console.log(appCard.title)
  miro.board.setAppData("app-card-modal-data", {
    card: appCard
  });
  // "The next actions are to define a goal or objective related to this feature, and who it will delight."

  // Fetch a specific app card by specifying its ID
  const url = `https://my.app.example.com/modal.html?appCardId=${appCard.id}`;
  // Open the modal to display the content of the fetched app card

  miro.board.ui.openPanel({ url: 'app-card-panel.html' });
  //miro.board.ui.openModal({    url,  });

  /*
    aiprompt(
      "Evaluate the text below and determine if it is an idea with a clearly-stated value to a busines or user of a system\n" + appCard.title +"\nA:",
      (x) => {
        var aiActions = appCard.fields.filter(function (f) {
          return f.value === 'AI Actions';
        });
        aiActions[0].tooltip = x.choices[0].text;
        appCard.sync();
      }
    );
    */
});



