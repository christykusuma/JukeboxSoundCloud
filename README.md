# SoundCloud Jukebox

This app allows users to add any public SoundCloud playlist or song into the jukebox. Simply submit the link to a playlist or song from the SoundCloud website and you're good to go!<br><br>
Feel free to play around with the <a target="_blank" href="http://christykusuma.com/soundcloud/">demo</a>.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You would need to register for an API Key to be able to obtain songs from SoundCloud.

Add your API Key as an environment variable in your `~/.bash_profile`.

```
export SOUNDCLOUD_CLIENT_ID="[YOUR_API_KEY_HERE]"
```

In the terminal:

```
source ~/.bash_profile
```

### Installing and Deployment

It's a very simple app, there isn't much to it. It should be up and running once you register for an API key.

## Built With

* HTML/SASS - Used for content and styling
* Javascript - Used for functionality
* [SoundCloud API](https://developers.soundcloud.com/docs/api/guide) - API used for obtaining songs and playlists

## Authors

* **Christy Kusuma** - [ChristyKusuma](https://github.com/christykusuma)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details