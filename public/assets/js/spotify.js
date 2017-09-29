var songarray = [];

$("#js-login").on('click', function(){

  var client_id = '1a9b73f4c2bf4cf09ca8e5797092c6c6';
  var redirect_uri = 'https://dancability-53d59.firebaseapp.com/';

  var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&show_dialog=' + encodeURIComponent(true);

  window.location = url;
});

var searchSongs = function (query) {
  $.ajax({
    url: 'https://api.spotify.com/v1/search',
    data: {
      q: query,
      type: 'track',
      limit: 5
    },
    success: function (response) {
      $('#js-results').empty();
      songarray = [];

      $.each(response.tracks.items,function(index){
          var song = this.name;
          var artist = this.artists[0].name;
          var id = this.id;
          $('#js-results').append("<p id='js-song-link' class='query-result' data-id="+id+">"+ song + " by " + artist +"</p><br>");
      });
    }
  });
};


function getAuth(){
  var hash = window.location.hash;
  var i = hash.indexOf('=');
  var j = hash.indexOf('&');
  var accessToken = hash.substring(i+1,j);

  return accessToken;
}

function isAuth(){
  return (window.location.hash != "") ? true : false;
}

var addSong = function (id) {
  var token = getAuth();
  $.ajax({
    url: 'https://api.spotify.com/v1/audio-features/' + id,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      console.log(response);
    }
  });

};

var getUser = function () {
  var token = getAuth();
  $.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      $('#js-welcome').html("Welcome "+response.id);
    }
  })
}
//
var getPlaylists = function () {
  var token = getAuth();
  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      $.each(response.items,function(index){
          var name = this.name;
          var id = this.id;
          var owner = this.owner.id;
          $('#js-show-playlists').append("<p id='js-playlist-link' class='query-result' data-owner='"+owner+"' data-id='"+id+"'>"+ name + "</p><br>");
      });
    }
  })
}

var getAudioData = function (ids) {

  var idStr = "";
  for (var i = 0; i < ids.length; i++) {
    if (i != ids.length) {
      idStr = idStr + ids[i] + ",";
    } else {
      idStr = idStr + ids[i];
    }
  }

  var token = getAuth();
  var songs;

  $.ajax({
    url: 'https://api.spotify.com/v1/audio-features/?ids='+idStr,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      var songData = response;
      console.log(songData);

      var circles = s1.selectAll("circle").data(songData.audio_features);
      circles.enter().append('circle')
      .attr("cx", function (song) {
        console.log(song.danceability);
        return xScale(song.danceability);
      })
      .attr("cy", function (song) {
        return yScale(song.energy);
      })
      .attr("r", 2)
      .attr("fill", "none")
      .attr("stroke", "#00BE44");

    }
  });
}


var showSongs = function (owner,id) {
  var token = getAuth();
  var id_list = [];
  $.ajax({
    url: "https://api.spotify.com/v1/users/"+owner+"/playlists/"+id+"/tracks",
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function (response) {
      console.log(response);

      $.each(response.items,function(index){
          var name = this.track.name;
          var id = this.track.id;
          id_list.push(id);
      });

      getAudioData(id_list);
    }
  });
}
