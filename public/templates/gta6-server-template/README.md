# GTA VI / Leonida State Starter Server Template
*Powered by GTA Money Team & Created by Lux Automaton*

This template serves as a comprehensive starting point for deploying roleplay servers centered around legal career pathways, transportation, and business strategies in Leonida State (GTA VI). It contains a clean configuration hierarchy, default server commands, and a client-side coordinate spawner framework.

---

## Folder Hierarchy

Ensure your server directory follows this layout structure:
```text
[gta6-server-root]/
├── config/
│   └── server.cfg                # Main server config, loading permissions and endpoints
├── resources/
│   └── [core]/
│       └── moneyteam-core/
│           ├── fxmanifest.lua     # Resource manifest declaration
│           ├── server/
│           │   └── player.lua     # Server-side player authentication and database setup
│           └── client/
│               └── spawn.lua      # Client-side spawner & coordinate teleport logs
└── README.md                      # Deployment & Customization documentation
```

---

## Deployment Steps

1. **Host Setup:** Get a Linux virtual server (VPS) or a Windows environment.
2. **Dependencies:** Install MariaDB or MySQL database server.
3. **Database Import:** Create a database named `gtavi_server` and configure the connection parameters inside `config/server.cfg` (Line 12).
4. **Keymaster Licensing:** Visit the FiveM Keymaster portal (`https://keymaster.fivem.net/`), register your server IP, obtain a license key, and paste it into `config/server.cfg` (Line 31).
5. **Launch Script:** Start the server executable pointing to the configuration file:
   ```bash
   ./FXServer +exec config/server.cfg
   ```

---

## Customization Instructions

### Adding New Spawns
To add new coordinate spawn sectors (e.g. custom nightclubs, warehouses, or business headquarters), open `resources/[core]/moneyteam-core/client/spawn.lua` and add coordinates to the `SpawnsCatalog` matrix (Line 9):
```lua
local SpawnsCatalog = {
    ['Custom Nightclub'] = { x = 120.45, y = -342.12, z = 15.6, heading = 90.0 }
}
```

### Script Security & Audits
Make sure to audit any custom third-party Lua files before placing them in the `resources` directory. Review raw database triggers and avoid scripts that contain obfuscated code or remote webhook commands that bypass admin security layers.

---

## Marketing & Monetization Guide

You can easily package and market modified variations of this server template:
1. **White-Label Branding:** Swap references of "GTA Money Team" with the branding profile of buyer communities.
2. **Pre-configured Channels:** Sell combined bundles featuring a matching Discord server layout with active tickets, moderator channels, and whitelist application forms.
3. **ZAP-Hosting Affiliate Programs:** Provide referral links for ready-to-run FiveM/txAdmin host configurations to earn affiliate margins on server hosting deployments.
