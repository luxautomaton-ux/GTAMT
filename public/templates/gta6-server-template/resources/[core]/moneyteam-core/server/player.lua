-- =========================================================================
--                    GTA VI / LEONIDA SERVER PLAYER CORE
--               Template Powered by GTA Money Team & Lux Automaton
-- =========================================================================

-- In-memory active players database cache
local ActivePlayers = {}
local PermissionRoles = {
    ['admin'] = 3,
    ['moderator'] = 2,
    ['user'] = 1
}

-- Helper function to print logs with timestamp and module markers
local function Log(message)
    print(string.format("[MoneyTeam-Core] [%s] %s", os.date("%Y-%m-%d %H:%M:%S"), message))
end

-- =========================================================================
-- Player Connection Handling
-- =========================================================================

-- Hook into player Connecting event to run initial licensing checks
AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    local src = source
    local identifiers = GetPlayerIdentifiers(src)
    local hasLicense = false

    -- Deferrals allow us to pause the connection and check credentials/whitelist status
    deferrals.defer()
    deferrals.update(string.format("Welcome %s. Auditing connection permissions...", playerName))
    Wait(1000) -- Simulate safety latency checks

    -- Loop through server identifiers to locate license/steam/discord IDs
    for _, identifier in ipairs(identifiers) do
        if string.find(identifier, "license:") then
            hasLicense = true
            break
        end
    end

    if not hasLicense then
        -- Cancel connection if player does not possess a valid game key license
        deferrals.done("Connection rejected: Valid license key not found. Please log into your client dashboard.")
        Log(string.format("Rejected connection from %s - missing license.", playerName))
    else
        deferrals.done()
        Log(string.format("Approved connection from %s.", playerName))
    end
end)

-- Hook into player joining state to instantiate cache profile
RegisterNetEvent('playerDropped')
AddEventHandler('playerDropped', function(reason)
    local src = source
    if ActivePlayers[src] then
        -- Save player details simulation (e.g. coordinates, cash, credentials) to DB
        Log(string.format("Saving profile data for %s (Dropped: %s)", ActivePlayers[src].name, reason))
        ActivePlayers[src] = nil
    end
end)

-- Initialize Player Session data when they trigger character selection
RegisterNetEvent('moneyteam:playerLoaded')
AddEventHandler('moneyteam:playerLoaded', function()
    local src = source
    local playerName = GetPlayerName(src)
    local licenseId = GetPlayerIdentifier(src, 0) -- Get base license key

    -- Create profile object cache
    ActivePlayers[src] = {
        name = playerName,
        license = licenseId,
        cash = 5000, -- Starter legit cash allocation
        bank = 25000, -- Starter savings deposit
        role = 'user' -- Default permission level
    }

    -- Set administrators by checking server config permissions
    if IsPlayerAceAllowed(src, "command") then
        ActivePlayers[src].role = 'admin'
    end

    Log(string.format("Session established for player %s. Role Assigned: %s", playerName, ActivePlayers[src].role))
    
    -- Sync core state variables back to client
    TriggerClientEvent('moneyteam:syncPlayer', src, ActivePlayers[src])
end)

-- =========================================================================
-- Permissions & Command API
-- =========================================================================

-- Exported helper function to check if player possesses sufficient permissions
exports('CheckPermission', function(playerId, requiredRole)
    local player = ActivePlayers[playerId]
    if not player then return false end

    local userRank = PermissionRoles[player.role] or 1
    local targetRank = PermissionRoles[requiredRole] or 1

    return userRank >= targetRank
end)

-- Sample chat command to check balance in real-time
RegisterCommand('balance', function(source, args, rawCommand)
    local src = source
    if src == 0 then
        print("[Console] Command cannot be executed from server window.")
        return
    end

    local player = ActivePlayers[src]
    if player then
        TriggerClientEvent('chat:addMessage', src, {
            color = { 0, 255, 0 },
            args = { "BANK DESK", string.format("Cash Balance: $%d | Savings Balance: $%d", player.cash, player.bank) }
        })
    else
        TriggerClientEvent('chat:addMessage', src, {
            color = { 255, 0, 0 },
            args = { "ERROR", "Profile data not active. Try re-logging." }
        })
    end
end, false)
