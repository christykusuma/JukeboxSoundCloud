
// Jukebox SoundCloud API - Christy Kusuma

// Tesing only with SoundCloud API!
// SoundCloud URL EX1: https://soundcloud.com/filous/sets/dawn-ep
// SoundCloud URL EX2: https://soundcloud.com/jeanflux/sets/lowlight
// Some songs/playlists are private and will not upload.  

// Initialize API key
SC.initialize({
  client_id: 'BLIKpIMvNL9As25CHX4l9xXLu7KuU5uF',
});

// Defining variables
let player;
var songs = [];
var currentSong = 0;
var dataTitle = "";
var dataDuration;
var dataURL;

// Buttons
var playButton = document.querySelector('.fa-play');
var stopButton = document.querySelector('.fa-stop');
var pauseButton = document.querySelector('.fa-pause');
var forwardButton = document.querySelector('.fa-forward');
var backwardButton = document.querySelector('.fa-backward');
var seekSlider = document.querySelector('.seekSlider');

// Information
var albumCover = document.querySelector('.albumCover');
var songTitle = document.querySelector('.songTitle');
var playlist = document.querySelector('.playlist');
var playlistSong = document.querySelector('.playlist li');
var playlistTitle = document.querySelector('h1');
var trackList = document.querySelector('.trackList');
var songArtist = document.querySelector('.songArtist');
var songDescription = document.querySelector('.songDescription');

// Submit URL buttons
var submitSong = document.querySelector('.submitSong');
var songURL = document.querySelector('.songURL');
var submitPlaylist = document.querySelector('.submitPlaylist');
var playlistURL = document.querySelector('.playlistURL');

// Jukebox constructor 
function Jukebox(apiKey, dataTitle, dataDuration) {

	this.songs = [];
	this.currentSong = 0;

	// Connect to new Jukebox API
	this.loadPlaylist(apiKey, dataTitle, dataDuration);

	// Play current track
	playButton.addEventListener("click", () => {
		console.log("play track");
		this.play();
	});

	// Pause current track
	pauseButton.addEventListener("click", () => {
		console.log("pause track");
		this.pause();
	});

	// Stop current track
	stopButton.addEventListener("click", () => {
		console.log("stop track");
		this.stop();
	});

	// Play next track
	forwardButton.addEventListener("click", () => {
		console.log("next track");
		this.forward();
		this.updateHTML(dataTitle, dataURL, dataDuration);
	});

	// Play last track
	backwardButton.addEventListener("click", () => {
		console.log("last track");
		this.backward();
		this.updateHTML(dataTitle, dataURL, dataDuration);
	});

	// Slider to move through track
	seekSlider.addEventListener("change", (event) => {
		console.log("slide through track");
  		let song = this.songs[this.currentSong];
  		console.log(song.duration);
	  	song.player.seek( event.target.value * song.duration / 100);
	});

	// Play song selected from playlist 
	playlist.addEventListener("click", (event) => {
		console.log("selected track");
		this.currentSong = parseInt(event.target.getAttribute("data-num"));
		this.play();
		this.updateHTML(dataTitle, dataURL, dataDuration);
	})

	// Upload track from SoundCloud URL
	submitSong.addEventListener("click", () => {
		console.log("upload new track");
		this.addSong(songURL.value);
		songURL.value = '';
	})

	// Upload playlist from SoundCloud URL
	submitPlaylist.addEventListener("click", () => {
		console.log('upload new playlist');

		// Convert playlist URL into proper API format
		SC.resolve(playlistURL.value).then((data) => {
		var playlistID = data.id;
		var playlistAPI = 'https://api.soundcloud.com/playlists/' + playlistID + '?client_id=BLIKpIMvNL9As25CHX4l9xXLu7KuU5uF';
		console.log(playlistAPI);
		this.dataTitle = data.title;
		this.dataURL = data.permalink_url;
		this.dataDuration = data.duration;

		// Passing new playlist into the Jukebox constructor
		const myJukebox = new Jukebox(playlistAPI, this.dataTitle, this.dataDuration);
		playlistURL.value = '';
	})
})

}

// Load SoundCloud playlist into Jukebox
Jukebox.prototype.loadPlaylist = function(apiKey, dataTitle, dataDuration) {
	SC.resolve(apiKey).then((data) => {
		console.log("load playlist into Jukebox", data);
		this.songs.push( ...data.tracks )
		this.updateHTML(dataTitle, dataURL, dataDuration);
	});
};

// Add song to Jukebox
Jukebox.prototype.addSong = function(songAPI) {
	SC.resolve(songAPI + '?client_id=BLIKpIMvNL9As25CHX4l9xXLu7KuU5uF').then((data) => {
		console.log('add song into Jukbox', data);
		this.songs.push(data);
		this.updateHTML(dataTitle, dataURL, dataDuration);
	})
};

// Play song from Jukebox
Jukebox.prototype.play = function() {
	console.log(this.songs[this.currentSong])

	// If song is already playing
	if( this.songs[this.currentSong].player ) {
		this.songs[this.currentSong].player.play();

		// Play next song when finished
		this.songs[this.currentSong].player.on("finish", () => {
			console.log("song ended (was in list)");
			this.forward();
			this.updateHTML(dataTitle, dataURL, dataDuration);
		});
	// If song isn't already playing, stream it!
	} else {
		SC.stream(`/tracks/${this.songs[this.currentSong].id}`).then((response) => {
		  this.songs[this.currentSong].player = response;
		 response.play();

		  // Play next song when finished
			response.on("finish", () => {
				console.log("song ended (wasn't on list");
				this.forward();
				this.updateHTML(dataTitle, dataURL, dataDuration);
			});
		});
	}
}

// Stop song from Jukebox
Jukebox.prototype.stop = function() {
	if( this.songs[this.currentSong].player ) {
		this.songs[this.currentSong].player.pause();
		this.songs[this.currentSong].player.seek(0);
	}
}

// Pause song from Jukebox
Jukebox.prototype.pause = function() {
	this.songs[this.currentSong].player.pause();
}

// Play next song from Jukebox
Jukebox.prototype.forward = function() {

	this.stop();
	if (this.currentSong === this.songs.length-1) {
		this.currentSong = -1; 
	}

	this.currentSong += 1;
	this.play();
}

// Play last song from Jukebox
Jukebox.prototype.backward = function() {
	
	this.stop();
	if (this.currentSong === 0) {
		this.currentSong = this.songs.length; }

		this.currentSong -= 1;
		this.play();
}

// Update slider value - NOT DONE YET!
Jukebox.prototype.updateSlider = function(slider) {
  slider.value = (this.songs[this.currentSong].player.currentTime() / this.songs[this.currentSong].duration) * 100;
};

// Convert playlist duration
function convertDuration(dataDuration) {
	hours = Math.floor(dataDuration / 3600000), // 1 Hour = 36000 Milliseconds
	minutes = Math.floor((dataDuration % 3600000) / 60000), // 1 Minutes = 60000 Milliseconds
	seconds = Math.floor(((dataDuration % 360000) % 60000) / 1000) // 1 Second = 1000 Milliseconds
    return hours + ":" + minutes + ":" + seconds;
}

// Update Jukebox HTML 
Jukebox.prototype.updateHTML = function(dataTitle, dataURL, dataDuration) {
	var songRef = this.songs[this.currentSong];

	// Convert dataDuration
	console.log(dataDuration);
	var newDataDuration = convertDuration(dataDuration);

	// Update song information
	playlistTitle.innerHTML = "<a href=" + dataURL + " target=_blank>" + dataTitle + "</a>";
	console.log(dataTitle);
	albumCover.src = songRef.artwork_url;
	songTitle.innerHTML = "<a href=" + songRef.permalink_url + " target=_blank>" + songRef.title + "</a>";
	trackList.innerText = this.songs.length + " tracks (" + newDataDuration + ")";
	songArtist.innerHTML = "By <a href=" + songRef.user.permalink_url + " target=_blank>" + songRef.user.username + "</a>"; 
	songDescription.innerText = songRef.description;
	seekSlider.value = 0;

	// Update playlist
	var playlistHTML = "";
	for (let i = 0; i < this.songs.length; i++) {
		var songHTML = '<li data-num="' + i +'">' + this.songs[i].title + '</li>';
		playlistHTML += songHTML;
	}
	playlist.innerHTML = playlistHTML;
}

// Make new Jukebox
document.addEventListener("DOMContentLoaded", function() {

	SC.resolve('https://soundcloud.com/jeanflux/sets/lowlight').then((data) => {
		console.log("upload default playlist", data);
	var playlistID = data.id;
	var playlistAPI = 'https://api.soundcloud.com/playlists/' + playlistID + '?client_id=BLIKpIMvNL9As25CHX4l9xXLu7KuU5uF';
	dataTitle = data.title;
	dataURL = data.permalink_url;
	dataDuration = data.duration;

	const myJukebox = new Jukebox(playlistAPI, dataTitle, dataDuration);

	// Set interval for updating slider value position
	setInterval( function() {
		myJukebox.updateSlider(seekSlider);
	}, 500);
	});
});

