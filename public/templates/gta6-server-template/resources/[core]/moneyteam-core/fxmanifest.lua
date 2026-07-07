# =========================================================================
#                    GTA VI / LEONIDA RESOURCE MANIFEST
#               Template Powered by GTA Money Team & Lux Automaton
# =========================================================================

# Declare the fx_version context (cerulean is modern standard)
fx_version 'cerulean'

# State compatibility with the modern game engine
game 'gta5' # Maps to modern servers; Leonida State compatibility layer active.

author 'Lux Automaton'
description 'Core Player Management, Spawn Points, and Permissions Engine for GTA VI Servers.'
version '1.0.0'

# Define server scripts to load
server_scripts {
    'server/player.lua'
}

# Define client scripts to load
client_scripts {
    'client/spawn.lua'
}
