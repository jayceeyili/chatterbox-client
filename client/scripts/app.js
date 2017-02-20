// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  roomname: 'lobby',
  lastMsgId: 0,
  messages: [],

  init: () => {
    app.username = window.location.search.substr(10);
    app.$roomSelect = $('.roomSelector');

    $('#send').on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    app.fetch(app.server);

  },

  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      // contentType: 'application/json',
      success: data => {
        console.log('chatterbox: Message sent');
        // console.log(data.objectId);
        $('#message').val('');
        app.fetch();
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
      // dataType: 'JSON',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: data => {
        if (!data.results || !data.results.length) {
          return;
        }
        app.messages = data.results;
        var latestMsg = data.results[data.results.length - 1];

        if (latestMsg.objectId !== app.lastMsgId) {
          app.renderRoomList(data.results);
          app.renderMessages(data.results);
          app.lastMsgId = latestMsg.objectId;
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

  renderRoomList: messages => {
    app.$roomSelect.html(`<option value="__newRoom"New Room...</option>`);

    if (messages) {
      var rooms = {};
      for (message of messages) {
        var roomName = message.roomname;
        if (roomName && !rooms[roomName]) {
          app.renderRoom(roomName);
          rooms[roomName] = true;
        }
      }
    }

    app.$roomSelect.val(app.roomname);
  },

  renderMessages: messages => {
    app.clearMessages();

    messages.filter(message => message.roomname === app.roomname).forEach(app.renderMessage);
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

  renderRoom: (room) => {
    var $option = $('<option/>').val(room).text(room);

    app.$roomSelect.append($option);
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
      roomname: app.roomname
    };
    app.send(message);
    $('#message').val(' ');
    app.clearMessages();
    app.fetch(app.server);
  },

};
