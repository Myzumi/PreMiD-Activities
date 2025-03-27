const presence = new Presence({
  clientId: '1354656000652869894',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

enum ActivityAssets { // Other default assets can be found at index.d.ts
  Logo = 'https://www.phonostar.de/images/auto_created/iloveradio3184x184.png',
}

presence.on('UpdateData', async () => {

  const presenceData: PresenceData = {
    largeImageKey: ActivityAssets.Logo,
    startTimestamp: browsingTimestamp,
  }

  const player = document.getElementById("ilrplayer")?.children[0] as HTMLAudioElement
    if (player.src) {

      // This should exists if the player is playing, as the user has selected a Channel 
      let CurrentChannelObject = document.getElementsByClassName("playing")[0] ? {
        SongName: document.getElementsByClassName("playing")[0]?.children[1]?.innerHTML,
        CoverURL: (document.getElementsByClassName("playing")[0]?.children[4] as HTMLImageElement).src
      } : null
      if (!CurrentChannelObject) {
        // This can happen if the User is on a Channel Page
        CurrentChannelObject = {
          SongName: document.getElementsByClassName("live")[0]?.parentElement?.children[2]?.children[0]?.innerHTML,
          CoverURL: (document.getElementsByClassName("live")[0]?.parentElement?.parentElement?.children[0]?.children[0] as HTMLImageElement ).src || ''
        }
      }
      // We can get the Channel Name from this, but due to the changing of the innerHTML, we can't get the song name
      const InfoPlayer = document.getElementById("above_player_inner")?.children
      if (!InfoPlayer) return 

      // Also exists when the player is collapsed, so its a viable source for the song name
      const CurrentChannelName = NormalizeString(InfoPlayer[0]?.innerHTML)
      const SongName = NormalizeString(CurrentChannelObject?.SongName)
      const ArtistCover = CurrentChannelObject?.CoverURL
      
      presenceData.details = CurrentChannelName
      presenceData.state = SongName
      presenceData.largeImageKey = ArtistCover;

    } else {
      presenceData.details = 'Browsing Channels...'
    }
  presence.setActivity(presenceData)
})

function NormalizeString(string: string = ''): string {
  const htmlEntities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }

  return string.replace(/&[a-zA-Z0-9#]+;/g, (entity) => htmlEntities[entity] || entity)
}