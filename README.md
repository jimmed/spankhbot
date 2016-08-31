# spankhbot

Weekend project; electron-based twitch bot for streamers

## Roadmap

 - [x] 0.1
   - [x] Basic Capabilities
     - [x] Login for bot account
     - [x] Login for streamer account
     - [x] Send/receive messages using either account
   - [x] Simple UI
     - [x] Sidebar
     - [x] Dashboard
       - [x] Chat
     - [x] Settings pane
       - [x] Accounts
       - [x] Plugins
 - [ ] 0.2
   - [ ] Plugin API
     - [ ] Pub/sub for
       - [x] Chat messages
       - [ ] Join/leave events
     - [ ] UI API
       - [x] Settings Pages
       - [ ] Main Pages
       - [ ] Dashboard widgets
       - [ ] Chat messages
     - [ ] Initial Plugins:
       - [ ] Auto-responder
         - [x] Settings pane to configure 1+ match/responses
         - [x] Respond to matched messages
           - [x] Regex match
           - [ ] Regex replace
       - [ ] Timed (single/repeating) announcements
         - [ ] Settings pane to configure 1+ announcements
         - [ ] Widget to show next announcement + create one-off
       - [ ] Auto-greet
         - [ ] Set greeting inline
         - [ ] Settings pane to configure custom greets
       - [ ] Emoticon support
         - [ ] Twitch emotes
         - [ ] BTTV emotes
 - [ ] 0.3
   - [ ] Permissions system for plugins
     - [ ] Fetch moderator list (timed w/force refresh button)
     - [ ] Plugin API has methods to get list/check user status
   - [ ] New plugins
     - [ ] Strikes/ban system
       - [ ] Widget to show highest strikes + last ban
       - [ ] Settings to show full details
     - [ ] Song request
       - [ ] Sources
         - [ ] YouTube 
         - [ ] SoundCloud
         - [ ] Spotify?
