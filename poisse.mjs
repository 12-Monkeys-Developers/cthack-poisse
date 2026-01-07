import MonkeysNews from "./module/monkeys-news.mjs"
import ModuleManagement from "./module/module-management.mjs"

import { CONSTANTS } from "./module/constants.mjs"

globalThis.CONSTANTS = CONSTANTS

let moduleManagement = await new ModuleManagement().withModuleId(CONSTANTS.MODULE_ID).withModuleVersion(CONSTANTS.MODULE_VERSION).withSystems(CONSTANTS.SYSTEMS)

let monkeysMessage = new MonkeysNews().withModuleId(CONSTANTS.MODULE_ID)

/*
 * Init Hook
 */
Hooks.once("init", async () => {
  console.log(CONSTANTS.LOG_HEADER + "Début de l'initialisation du module")

  moduleManagement.registerSettings()
  monkeysMessage.registerSettings()

  console.log(CONSTANTS.LOG_HEADER + "Fin de l'initialisation du module")
})

Hooks.on("ready", () => {
  // Si le module est activé pour la première fois, affiche la fenêtre d'importation de l'aventure
  if (!game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTING_IMPORTED) && game.user.isGM) {
    moduleManagement.moduleImport(game.system.id)
  } else if (game.user.isGM) {
    let installedModuleVersion = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTING_MODULE_VERSION)
    // Si le module a déjà été installé et que c'est une nouvelle version, mise à jour du module
    if (game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.SETTING_IMPORTED) && foundry.utils.isNewerVersion(CONSTANTS.MODULE_VERSION, installedModuleVersion)) {
      moduleManagement.updateModule(game.system.id)
    }
  }

  monkeysMessage.sendChatMessage()
  console.log(CONSTANTS.LOG_HEADER + "Module " + CONSTANTS.MODULE_NAME + " prêt !")
})

/*
 * Import Adventure Hook
 */
Hooks.on("importAdventure", (adventure, formData, created, updated) => {
  // Import de l'aventure
  moduleManagement.adventureImport(game.system.id, adventure, created, updated)
})

/*
/* Render Journal Sheet Hook to style the Journal Entry

Hooks.on("renderJournalEntrySheet", (application, element, context, options) => {
  if (application.document.getFlag("cthack-secrets", "isSecrets") === true) {
    element.classList.add("cthack-secrets-journal")
  }
}) */

