
var app = {
  server: 'http://127.0.0.1:3000/classes/messages',
  currentRoom: undefined,
  friendList: [],
  buttons: [],
  url: $(location).attr('href'),

  init: function() {
    app.username = prompt('What is your username?');
  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function () {
        console.log('chatterbox: Message sent');
        app.addMessage(message);
      },
      error: function () {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        data = JSON.parse(data);
        data.results.sort(function(a, b) {return b.createdAt - a.createdAt;});
        app.displayMessages(data);

        $('li').click(function(){
          var text = $(this).html();
          var friendName = text.substring(text.indexOf('|') + 2, text.indexOf(':') - 1);
          app.friendList.push(friendName);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  displayMessages: function(data) {
    app.clearMessages();
    for (var i = data.results.length - 1; i >= 0; i--){
      app.addMessage(data.results[i]);
    }
    app.addRooms(data);

  },

  addRooms: function(data) {
    $('#roomSelect').empty();
    var rooms = [];

    for (var i = data.results.length - 1; i >= 0; i--){
      var currentData = data.results[i].roomname;
      if (rooms.indexOf(currentData) === -1){
        rooms.push(currentData);
        app.addRoom(currentData);
      }
    }

    $('.room').click(function(){
      app.currentRoom = this.id;
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addMessage: function(message) {
    if (message.roomname === app.currentRoom || app.currentRoom === undefined){
      if (app.friendList.indexOf(message.username) !== -1){
        $('#chats').prepend('<li><b>' + message.roomname + ' | ' + message.username + ' : ' + message.text + '</b></li>');
      } else {
        $('#chats').prepend('<li>' + message.roomname + ' | ' + message.username + ' : ' + message.text + '</li>');
      }
    }
  },

  addRoom: function(roomname) {
    $('#roomSelect').append('<button class= "room" id= "' + roomname + '">' + roomname + '</button>');
  }
};

////////////// DOC READY //////////////////

$(function() {
  app.init();

  window.setInterval(function() {
    app.fetch();
  }, 1000);

  $('#sendButton').click(function(){
    var sendMessage = {
      username: app.username,
      text: $('#newMessage').val(),
      roomname: app.currentRoom || 'lobby'
    };
    app.send(sendMessage);
  });

  $('#allrooms').click(function(){
    app.currentRoom = undefined;
  });

  $('#createRoom').click(function(){
    app.currentRoom = $('#newRoom').val();
    $('#defaults').append('<button class = "room" id = "' + app.currentRoom + '">' + app.currentRoom + '</button>');
  });
});

