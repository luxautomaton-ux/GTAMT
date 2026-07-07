-- =========================================================================
--                    GTA VI / LEONIDA CLIENT SPAWN CORE
--               Template Powered by GTA Money Team & Lux Automaton
-- =========================================================================

local PlayerState = {}
local FirstSpawn = true

-- Pre-configured coordinates mapping legal career starter routes in GTA VI (Leonida State)
local SpawnsCatalog = {
    ['Vice City Airport'] = { x = -1035.42, y = -2732.18, z = 13.75, heading = 328.5 },
    ['Ocean Drive Motel'] = { x = 245.12, y = -1450.45, z = 29.15, heading = 110.2 },
    ['Leonida Keys Marina'] = { x = 852.34, y = 145.89, z = 5.24, heading = 45.0 }
}

-- =========================================================================
-- Event Handlers & Sync
-- =========================================================================

-- Sync state object from server session manager
RegisterNetEvent('moneyteam:syncPlayer')
AddEventHandler('moneyteam:syncPlayer', function(data)
    PlayerState = data
    print(string.format("[MoneyTeam-Core] Synced state variables: %s - Role: %s", PlayerState.name, PlayerState.role))
end)

-- Main logic loops to catch connection sequences
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        -- Trigger loading sequences when player joins the native server environment
        if NetworkIsSessionActive() and FirstSpawn then
            FirstSpawn = false
            Citizen.Wait(2000) -- Buffer time to let map textures stream in

            -- Initiate player load request to server
            TriggerServerEvent('moneyteam:playerLoaded')
            
            -- Open Spawner Navigation Menu
            OpenSpawnSelectionMenu()
            break
        end
    end
end)

-- =========================================================================
-- Spawn Logic Handler
-- =========================================================================

-- Displays spawn options and coordinates selections
function OpenSpawnSelectionMenu()
    print("[MoneyTeam-Core] Loading Spawn Selection Panel...")
    
    -- Print out configuration list to client logs for diagnostics
    for spawnName, coords in pairs(SpawnsCatalog) do
        print(string.format("Spawn Config: %s | X: %.2f Y: %.2f", spawnName, coords.x, coords.y))
    end

    -- Trigger default spawn at Ocean Drive Motel for initial setup
    ExecuteSpawn('Ocean Drive Motel')
end

-- Teleports client character model and loads vehicle layouts
function ExecuteSpawn(spawnKey)
    local coords = SpawnsCatalog[spawnKey]
    if not coords then return end

    local ped = PlayerPedId()

    -- Start camera transition sequences
    DoScreenFadeOut(500)
    while not IsScreenFadedOut() do
        Citizen.Wait(10)
    end

    -- Relocate character coordinate vectors
    SetEntityCoords(ped, coords.x, coords.y, coords.z, false, false, false, true)
    SetEntityHeading(ped, coords.heading)
    
    -- Request model collision updates around teleport points
    RequestCollisionAtCoord(coords.x, coords.y, coords.z)
    
    -- Lock characters in place during texture stream blocks
    FreezeEntityPosition(ped, true)
    
    Citizen.Wait(1000)
    
    FreezeEntityPosition(ped, false)
    DoScreenFadeIn(1000)

    print(string.format("[MoneyTeam-Core] Spawning sequence completed at: %s", spawnKey))

    -- Add a prompt message to the user HUD
    TriggerEvent('chat:addMessage', {
        color = { 255, 165, 0 },
        args = { "MONEY TEAM", string.format("You spawned at %s. Open the Route Planner to start earning legit cash!", spawnKey) }
    })
end
