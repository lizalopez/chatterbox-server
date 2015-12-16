//YOUR CODE HERE:
var def = {
  username: 'anon',
  text: 'trololo',
  roomname: 'lobby',
};
var rooms = {"lobby" : "lobby"};
var userRooms = {};
var friends = {};
var app = {};
app.init = function(){};
var messages;
app.server = 'http://127.0.0.1:3000/classes/';

app.send = function(message , user, roomname, tag){
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
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server + "room1",
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      // if(data.results.roomname){console.log('tagged')}
      console.log('chatterbox: Message recieved');
      messages = JSON.parse(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

  $(document).ajaxSuccess(function() {
    //$( ".log" ).text( "Triggered ajaxSuccess handler." );
    displayMessages()
  });
}

app.clearMessages = function() {
  $(".username").remove();
  $(".chat").remove();
  $("#chats br").remove();
}

app.addMessage = function(message, user, roomname, tag) {
if(typeof message !== "object"){
    message = {
      text: message,
      username: user || def.username,
      roomname: roomname || def.roomname,
      tag: tag
    }
    app.send(message);
  }
  else{
    message.tag = def.tag
    app.send(message);
  }
  app.fetch();
}


var submit = function() {
  var room = $('.roomInput')[0].value
  $('.roomInput').val("")
  if(room.length){
    def.roomname = room;
  }
  var message = $(".messageInput")[0].value
  $('.messageInput').val("");
  if(message.length){
    app.addMessage(message, def.username, def.roomname);
  }
}


app.renderRoom = function(roomname ){
  $("#roomSelect").append("<button class = room>"+roomname+ "</button>");
}

app.addRoom = function(roomname){
  userRooms[roomname] = roomname
}

app.addFriend = function(friend) {
  friends[friend] = true
};

var displayMessages = function() {
  rooms = {}
  app.clearMessages();
  for (var i = 0; i < messages.results.length; i++) {
    if(messages.results[i].text){
      var roomname = escapeHtml(messages.results[i].roomname);
      var text = escapeHtml(messages.results[i].text);
      var username = escapeHtml(messages.results[i].username);
      if(!roomname.length){
        roomname = "lobby"
      }

      rooms[roomname] = roomname
      if(roomname === def.roomname){
        if(!username.length){
          username = "anon"
        }
        if(username === def.username){
          $("#chats").append("<span class = username>" + username+"</span>")
          $("#chats").append("<div class = 'chat user'>"+text+"</div><br>")
        }else if(friends[username]){
          $("#chats").append("<span class = username>" + username+"</span>")
          $("#chats").append("<div class = 'chat friend'>"+text+"</div><br>")      
        }
        else{
          $("#chats").append("<span class = username>" + username+"</span>")
          $("#chats").append("<div class = chat>" + text +"</div><br>")
        }
      }
    }
  }
  //add roomnames to ul
  $('.room').remove()
  for(var keys in rooms){

    app.renderRoom(keys)
  }
  for(var keys in userRooms){

    app.renderRoom(keys)
  }
}


function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

$(document).ready(function(){
  def.username = window.prompt("Please enter your username", undefined) || def.username;
  
  // ON USERNAME CLICK
  $('#main').on('click','.username',function(){
    // console.log(this.textContent)
    var friend = this.textContent; 
    app.addFriend(friend)
    app.fetch()
  });

  // ON SUBMIT CLICK
  $('#main').on('click','.messageButton',submit);

  $('#main').on('click','.room',function(){
    def.roomname = this.textContent;
    displayMessages();
    console.log("CHANGED ROOMS?")
  });

  app.fetch();
  setInterval(app.fetch, 4000);
});
