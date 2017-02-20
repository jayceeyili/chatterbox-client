// YOUR CODE HERE:
var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  username: 'Genghis Khan',
  roomname: 'lobby',
  lastMsgId: 0,
  messages: [],
  friends: {},

  init: () => {
    app.username = window.location.search.substr(10);
    app.$roomSelect = $('.roomSelector');

    app.$roomSelect.on('change', app.handelRoomSelete);
    $('#chats').on('click', '.username', app.handleUsernameClick);

    app.fetch();
  },

  send: (message) => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: message,
      // data: JSON.stringify(message),
      // contentType: 'application/json',
      success: data => {
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
        // console.log('chatterbox: Message Data Recieved', data);
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
    app.$roomSelect.html(`<option value="__newRoom">New Room...</option>`);

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
    var $chat = $('<div class="alert alert-info" role="alert"/>');
    // var escapeHtml = text => {
    //   return text.replace(/[\"&<>]/g, a => {
    //     return { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[a];
    //   });
    // };
    // var newMessage = escapeHtml(message.text);
    // var user = message.username;
    // var $node = $(`<div class='alert alert-info' role='alert'><p><span class='username'>${user}</span>:   ${newMessage}</p></div>`);
    // // $('.username').on('click', app.handleUsernameClick);
    // if (app.friends[user] === true) {
    //   $('.username').addClass('friend');
    // }

    var $user = $('<span class="username"/>');
    $user.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);
    if (app.friends[message.username] === true) {
      $user.addClass('friend');
    }

    var $msg = $('<span/>');
    $msg.text(message.text).appendTo($chat);
    $('#chats').append($chat);
  },

  renderRoom: (room) => {
    var $option = $('<option/>').val(room).text(room);

    app.$roomSelect.append($option);
  },

  handelRoomSelete: () => {
    var selected = app.$roomSelect.prop('selectedIndex')

    if (selected === 0) {
      var newName = prompt('Please Enter Your Room Name');

      if (newName) {
        app.roomname = newName;
        app.renderRoom(newName);
        app.$roomSelect.val(newName);
      }
    } else {
      app.roomname = app.$roomSelect.val();
    }
    // console.log(app.roomname);
    app.renderMessages(app.messages);
  },

  handleUsernameClick: event => {
    // var username = event.target.innerHTML;
    var username = $(event.target).data('username');
    // console.log(username);
    // Toggle!
    app.friends[username] = !app.friends[username];
    var $usernames = $(`[data-username=${username}]`).toggleClass('friend');
  },

  handleSubmit: () => {
    var $message = $('#message').val();
    var message = {
      username: app.username,
      text: $message,
      roomname: app.roomname || '8 floor'
    };
    app.send(message);
    $('#message').val('');
    app.clearMessages();
    app.fetch();
  },

};
