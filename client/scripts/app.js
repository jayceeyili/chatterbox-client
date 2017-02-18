// YOUR CODE HERE:
var app = {
  init: () => {
    $('#send').on('submit', app.handleSubmit);
  },

  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.hrsf.hackreactor.com/chatterbox/classes/messages',
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
      // url: 'http://parse.hrsf.hackreactor.com/chatterbox/classes/messages',
      url: undefined,
      type: 'GET',
      // data: JSON.parse(message),
      data: {
        format: 'json'
      },
      dataType: 'jsonp',
      // contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message Data Recieved');
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
    var user = message.username;
    var $node = $(`<p><span class="username"> ${user} ${newMessage} </span></p>`);
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
  }
};

