# AItastic

Weekend project; electron-based twitch bot for streamers

## Roadmap

 - 0.0
   - Basic Capabilities
     - Login for bot account
     - Login for streamer account
     - Send/receive messages using either account
   - Simple UI
     - Sidebar (icons)
     - Dashboard
       - Chat
       - Room for collapsible widgets
     - Settings pane
       - Accounts
 - 0.2
   - Plugin API
     - Pub/sub for
       - Chat messages
       - Join/leave events
     - UI API
       - Settings Pages
       - Main Pages
       - Dashboard widgets
     - Initial Plugins:
       - Timed (single/repeating) announcements
         - Settings pane to configure 1+ announcements
         - Widget to show next announcement + create one-off
       - Auto-greet
         - Enable/disable button
         - Set greeting inline
         - Settings pane to configure custom greets
     - UI
       - Settings panes
         - Plugins enable/disable
  - 0.3
   - Moderator controls for plugins
   - Plugin API
     - Inter-mod messaging
   - New plugins:
     - Strikes/ban system
       - Widget to show highest strikes + last ban
       - Settings to show full details
     - Dupe detection?
       - Connect to ban system
   
