# GTA VI Roleplay Recruitment & Interview Server Template
*Xenon Template Config — Code: BeCBNxJcJaRv*

This template provides a comprehensive setup guide and channel outline for managing interviews, whitelist applications, and department communications (LEO/EMS) on GTA roleplay community Discord servers.

---

## 1. Discord Channel Architecture

Configure your Discord server category and channel settings as follows:

```text
👋 ── WELCOME & INFO
│   ├── #rules-and-safety      (Read-only for @everyone)
│   ├── #announcements         (Read-only for @everyone, write for Admin)
│   └── #server-status         (Embeds txAdmin notifications)
📝 ── REGISTRATION
│   ├── #how-to-apply          (Details application procedures)
│   ├── #whitelist-apps        (Players post Google Form links)
│   └── #application-status    (Staff updates whitelist acceptance logs)
🎤 ── INTERVIEW HUB
│   ├── #interview-queue       (Waitlist tickets using bot channels)
│   ├── 🔊 | Waiting Room       (Muted join chamber for candidates)
│   ├── 🔊 | Interview Room 1   (Private room for cadet screening)
│   └── 🔊 | Interview Room 2   (Private room for staff screening)
👮 ── LEO ACADEMY
│   ├── #ten-codes-reference   (Ten-codes reference lists)
│   ├── #dispatch-logs         (Dispatch reports logs)
│   └── 🔊 | Dispatch Comm Room (Department patrol voice chat)
```

---

## 2. Essential Police Ten-Codes Reference

Add these standard ten-codes to your LEO manual or `#ten-codes-reference` channel:

| Code | Meaning | Usage Scenario |
|---|---|---|
| **10-4** | Acknowledged / Message Received | To confirm orders from dispatch. |
| **10-8** | In Service / Active Duty | When starting a patrol shift. |
| **10-10** | Fight in Progress | Responding to active physical altercations. |
| **10-19** | Return to Police Station | Returning to headquarters for booking. |
| **10-20** | State Your Current Location | Verification of unit coordinate areas. |
| **10-99** | Officer Needs Immediate Assistance | Critical distress panic button. |

---

## 3. How to Deploy via Xenon Bot

To load this exact server layout:
1. **Invite the Bot:** Add Xenon bot to your Discord server via the developer portal or (`https://xenon.bot`).
2. **Execute Command:** Run this slash command in your primary setup channel:
   ```text
   /template load name_or_id:BeCBNxJcJaRv
   ```
3. **Confirm Load:** Click the confirmation prompt. The bot will automatically populate your server structure, channels, voice zones, and role configurations within 60 seconds.
