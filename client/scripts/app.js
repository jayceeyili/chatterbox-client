// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  init: () => {
    $('#send').on('submit', app.handleSubmit);
    app.fetch(app.server);
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
        // console.log(data.objectId);
        app.fetch(app.server + '/' + data.objectId);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: (server) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      // url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      url: server,
      type: 'GET',
      dataType: 'JSON',
      data: 'order=-createdAt',
      contentType: 'application/json',
      //dataType: 'json',
      success: function (data) {
        if (data.results) {
          // console.log('have results object');
          for (var key in data.results) {
            app.renderMessage(data.results[key]);
            if (data.results[key].roomname) {
              $('.dropdown-menu').append(`<li><a href="#">${data.results[key].roomname}</a></li>`);
            }
          }
        } else {
          // console.log('have data object');
          app.renderMessage(data);
          // app.init();
        }
        console.log(app.rooms);
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
    var escapeHtml = function (text) {
      'use strict';
      return text.replace(/[\"&<>]/g, function (a) {
        return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
      });
    };
    var newMessage = escapeHtml(message.text);
    var user = message.username;
    var $node = $(`<div class='alert alert-info' role='alert'><p><span class='username'> ${user} </span>${newMessage}</p></div>`);
    $('.username').on('click', app.handleUsernameClick);
    $addChats.append($node);
  },

  renderRoom: (string) => {
    var $roomSelect = $('#roomSelect');
    // var room = string;
    $roomSelect.append('<p>`  ${string} `</p>');
  },

  handleUsernameClick: (e) => {
    console.log(e.target.innerHTML);
    // console.log('clicked');
    // console.log($(this).find('span').html());
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
    app.clearMessages();
    app.fetch(app.server);
  },
  
  rooms: [],

};

