const CLIENT_ID = '583831898556-c3kj832e1hh1dmee9j953fprlrs3vies.apps.googleusercontent.com';
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const dugmeZaLogIn = document.getElementById('authorize-button');
const dugmeZaLogOut = document.getElementById('signout-button');
const sadrzaj = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const podrazumevaniKanal = 'elabrs';

// Init API client library and set up sign in listeners
function inicijalizujKlijenta() {
  gapi.client
    .init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    })
    .then(() => {
      // osluskuj promene - da li se korisnik ulogovao/izlogovao
      gapi.auth2.getAuthInstance().isSignedIn.listen(azurirajStatusLogovanja);
      // Handle initial sign in state
      azurirajStatusLogovanja(gapi.auth2.getAuthInstance().isSignedIn.get());
      dugmeZaLogIn.onclick = obradiLogIn;
      dugmeZaLogOut.onclick = obradiLogOut;
    });
}

// Load auth2 library
function handleClientLoad() {
  gapi.load('client:auth2', inicijalizujKlijenta);
}


// apdejtuj korisnicki interfejs u zavisnosti od toga da li je ulogovan
function azurirajStatusLogovanja(isSignedIn) {
  if (isSignedIn) {
    dugmeZaLogIn.style.display = 'none';
    dugmeZaLogOut.style.display = 'block';
    sadrzaj.style.display = 'block';
    videoContainer.style.display = 'block';
    
    uzmiPodatkeOKanalu(podrazumevaniKanal);
  } else {
    dugmeZaLogIn.style.display = 'block';
    dugmeZaLogOut.style.display = 'none';
    sadrzaj.style.display = 'none';
    videoContainer.style.display = 'none';
  }
}

function obradiLogIn(){
  gapi.auth2.getAuthInstance().signIn();
}

function obradiLogOut() {
  gapi.auth2.getAuthInstance().signOut();
}


// Get channel from API
function uzmiPodatkeOKanalu(channel) {
  gapi.client.youtube.channels
    .list({
      part: 'snippet,contentDetails,statistics',
      forUsername: channel
    })
    .then(response => {
      console.log(response);
      const channel = response.result.items[0];

      const output = `
        <ul class="collection">
          <li class="collection-item">Title: ${channel.snippet.title}</li>
          <li class="collection-item">ID: ${channel.id}</li>
          <li class="collection-item">Subscribers: ${
            channel.statistics.subscriberCount
          }</li>
          <li class="collection-item">Views: ${
            channel.statistics.viewCount
          }</li>
          <li class="collection-item">Videos: ${
            channel.statistics.videoCount
          }</li>
        </ul>
        <p>${channel.snippet.description}</p>
        <hr>
        <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${
          channel.snippet.customUrl
        }">Visit Channel</a>
      `;
      prikaziPodatkeOKanalu(output);

      //const playlistId = channel.contentDetails.relatedPlaylists.uploads;
      //requestVideoPlaylist(playlistId);
    })
    .catch(err => alert('Nije pronađen kanal sa tim imenom'));
}

// Display channel data
function prikaziPodatkeOKanalu(podaci) {
  const podaciOKanalu = document.getElementById('channel-data');
  podaciOKanalu.innerHTML = podaci;
}

// Form submit and change channel
channelForm.addEventListener('submit', e => {
  e.preventDefault();

  const kanal = channelInput.value;

  uzmiPodatkeOKanalu(kanal);
});
