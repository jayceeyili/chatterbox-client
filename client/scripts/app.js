// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  init: () => {
    $('#send').on('submit', app.handleSubmit);
  },

  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: () => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      // url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      url: app.server,
      type: 'GET',
      // data: JSON.parse(message),
      dataType: 'json',
      // contentType: 'application/json',
      success: function (data) {
        var tweets = data.results;
        for (var key in tweets) {
          app.renderMessage(tweets[key]);
        }

        console.log('chatterbox: Message Data Recieved', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve message', data);
      }
    });
  },

  clearMessages: () => {
    var $chats = $('#chats');
    $chats.html('');
  },

  renderMessage: (message) => {
    var $addChats = $('#chats');
    var newMessage = message.text;
    var user = message.username.toUpperCase();
    var $node = $(`<p><span class="username"> ${user} </span>${newMessage}</p>`);
    $node.on('click', app.handleUsernameClick);
    $addChats.append($node);
  },

  renderRoom: (string) => {
    var $roomSelect = $('#roomSelect');
    // var room = string;
    $roomSelect.append('<p>`  ${string} `</p>');
  },

  handleUsernameClick: (message) => {
  },

  handleSubmit: () => {
    var $message = $('#message').val();
    var message = {
      username: 'Genghis Khan',
      text: $message,
      roomname: '8 floor'
    };
    app.send(message);
    $('#message').val(' ');
  }
};

