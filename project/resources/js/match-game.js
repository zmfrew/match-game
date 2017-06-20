var MatchGame = {};


/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
$(document).ready(function() {
  var $game = $('#game');

  $('#restart').on('click', function() {
    MatchGame.start($game);
  });

  MatchGame.start($game);
});

MatchGame.start = function($game) {
  var $score = $('#score');

  $game.data('flippedCards', []);
  $game.data('found', 0);
  $game.data('moves', 0);
  $score.text('You found 0/8 pairs in 0 moves.');
  MatchGame.renderCards(MatchGame.generateCardValues(), $game);
};


/*
  Generates and returns an array of matching card values.
 */
MatchGame.generateCardValues = function() {
  var values = [];
  var i;
  var randoms = [];
  var newRandom;
  var shuffled;

  for (i = 1; i <= 8; i++) {
    values.push(i);
    values.push(i);
  }
  for (i = 0; i < 16; i++) {
    do {
      newRandom = Math.random();
    } while (randoms.includes(newRandom));
    randoms[i] = newRandom;
  }
  shuffled = randoms.slice(0);
  randoms.sort();
  for (i = 0; i < 16; i++) {
    shuffled[i] = values[randoms.indexOf(shuffled[i])];
  }
  return shuffled;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/
MatchGame.renderCards = function(cardValues, $game) {
  var i;
  $game.empty();
  for (i = 0; i < 16; i++) {
    var $card = MatchGame.createCard(cardValues[i], $game);
    $game.append($card);
  }
};

MatchGame.createCard = function(value, $game) {
  var colors = ['green', 'red', 'blue', 'black', 'orange', 'brown', 'indigo', 'grey'];
  var $card = $('<div class="card"><div>');
  $card.data('value', value);
  $card.data('flipped', false);
  $card.data('color', colors[value - 1]);
  $card.on('click', function() {
    MatchGame.flipCard($card, $game);
  });
  return $card;
}

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */
MatchGame.flipCard = function($card, $game) {
  var flipped = $game.data('flippedCards');
  var $anotherCard;
  var moves = $game.data('moves');
  var found = $game.data('found');
  var message = '';
  var $score = $('#score');

  if ($card.data('flipped') || flipped.length === 2) {
    return;
  }
  MatchGame.flip($card);
  flipped.push($card);
  if (flipped.length === 2) {
    moves++;
    $game.data('moves', moves);
    $anotherCard = flipped[0];
    if ($card.data('value') === $anotherCard.data('value')) {
      MatchGame.matched($card);
      MatchGame.matched($anotherCard);
      found++;
      $game.data('found', found);
      $game.data('flippedCards', []);
    } else {
      window.setTimeout(function() {
        MatchGame.unflip($card);
        MatchGame.unflip($anotherCard);
        $game.data('flippedCards', []);
      }, 500);
    }
    message = 'You found ' + found + '/8 pairs in ' + moves + ' moves.';
    if (found === 8) {
      message = message + 'You won!';
    }
    $score.text(message);
  }
};

MatchGame.flip = function($card) {
  $card.css('background-color', $card.data('color'));
  $card.text($card.data('value'));
  $card.data('flipped', true);
}

MatchGame.unflip = function($card) {
  $card.css('background-color', 'rgb(32, 64, 86)');
  $card.empty();
  $card.data('flipped', false);
}

MatchGame.matched = function($card) {
  $card.css('background-color', 'rgb(153, 153, 153)');
  $card.css('color', 'grey');
}
