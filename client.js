var Client = require('bittorrent-tracker')

var requiredOpts = {
  infoHash: new Buffer('012345678901234567890'), // hex string or Buffer
  peerId: new Buffer('01234567890123456789'), // hex string or Buffer
  announce: [], // list of tracker server urls
  port: 6881 // torrent client port, (in browser, optional)
}

var optionalOpts = {
  // RTCPeerConnection config object (only used in browser)
  rtcConfig: {},
  // User-Agent header for http requests
  userAgent: '',
  // Custom webrtc impl, useful in node to specify [wrtc](https://npmjs.com/package/wrtc)
  wrtc: {},
  getAnnounceOpts: function () {
    // Provide a callback that will be called whenever announce() is called
    // internally (on timer), or by the user
    return {
      uploaded: 0,
      downloaded: 0,
      left: 0,
      customParam: 'blah' // custom parameters supported
    }
  },
  // Proxy config object
  proxyOpts: {
      // Socks proxy options (used to proxy requests in node)
      socksProxy: {
          // Configuration from socks module (https://github.com/JoshGlazebrook/socks)
          proxy: {
              // IP Address of Proxy (Required)
              ipaddress: "1.2.3.4",
              // TCP Port of Proxy (Required)
              port: 1080,
              // Proxy Type [4, 5] (Required)
              // Note: 4 works for both 4 and 4a.
              // Type 4 does not support UDP association relay 
              type: 5,
              
              // SOCKS 4 Specific:
              
              // UserId used when making a SOCKS 4/4a request. (Optional)
              userid: "someuserid",

              // SOCKS 5 Specific:
      
              // Authentication used for SOCKS 5 (when it's required) (Optional)
              authentication: {
                  username: "Josh",
                  password: "somepassword"
              }
          },
          
          // Amount of time to wait for a connection to be established. (Optional)
          // - defaults to 10000ms (10 seconds)
          timeout: 10000
      },
      // NodeJS HTTP agents (used to proxy HTTP and Websocket requests in node)
      // Populated with Socks.Agent if socksProxy is provided
      httpAgent: {},
      httpsAgent: {}
  },
}

var client = new Client(requiredOpts)

client.on('error', function (err) {
  // fatal client error!
  console.log(err.message)
})

client.on('warning', function (err) {
  // a tracker was unavailable or sent bad data to the client. you can probably ignore it
  console.log(err.message)
})

// start getting peers from the tracker
client.start()

client.on('update', function (data) {
  console.log('got an announce response from tracker: ' + data.announce)
  console.log('number of seeders in the swarm: ' + data.complete)
  console.log('number of leechers in the swarm: ' + data.incomplete)
})

client.once('peer', function (addr) {
  console.log('found a peer: ' + addr) // 85.10.239.191:48623
})

// announce that download has completed (and you are now a seeder)
client.complete()

// force a tracker announce. will trigger more 'update' events and maybe more 'peer' events
client.update()

// provide parameters to the tracker
client.update({
  uploaded: 0,
  downloaded: 0,
  left: 0,
  customParam: 'blah' // custom parameters supported
})

// stop getting peers from the tracker, gracefully leave the swarm
client.stop()

// ungracefully leave the swarm (without sending final 'stop' message)
client.destroy()

// scrape
client.scrape()

client.on('scrape', function (data) {
  console.log('got a scrape response from tracker: ' + data.announce)
  console.log('number of seeders in the swarm: ' + data.complete)
  console.log('number of leechers in the swarm: ' + data.incomplete)
  console.log('number of total downloads of this torrent: ' + data.downloaded)
})
