import * as SETTINGS from "./constants.mjs"
import * as Updates from "./module-updates.mjs"

export default class ModuleManagement {
  constructor() {
    this.moduleId = null
    this.moduleVersion = null
    this.systems = null
  }

  /**
   *
   * @param {*} moduleId
   * @returns
   */
  withModuleId(moduleId) {
    this.moduleId = moduleId
    return this
  }

  /**
   *
   * @param {*} moduleVersion
   * @returns
   */
  withModuleVersion(moduleVersion) {
    this.moduleVersion = moduleVersion
    return this
  }

  /**
   *
   * @param {Object[]} systems Array of system
   *  Exemple of a system object
   *    {
   *     adventurePackName: "cthack-encages.cthulhu-hack-encages",
   *     adventureId: "j5GcXmGaJnewMUH3",
   *     systemName: "Cthulhu Hack",
   *     adventureVersion: "1.0.1",
   *     adventurePackLabel: "Les Encagés",
   *     welcomeJournalEntryId: "jcDyTqPkQTu44wkQ"
   *     }
   * @returns
   */
  withSystems(systems) {
    this.systems = systems
    return this
  }

  /**
   * @description Met à jour la version du module et affiche la fenêtre d'importation de l'aventure
   */
  async moduleImport(systemId) {
    game.settings.set(this.moduleId, SETTINGS.SETTING_MODULE_VERSION, this.moduleVersion)
    await this._adventureImportDisplay(systemId)
  }

  /**
   * @description Met à jour la version du module et propose d'importer l'aventure si une nouvelle version est disponible
   */
  async updateModule(systemId) {
    game.settings.set(this.moduleId, SETTINGS.SETTING_MODULE_VERSION, this.moduleVersion)

    let installedAdventureVersion = game.settings.get(this.moduleId, SETTINGS.SETTING_ADVENTURE_VERSION)

    // Si l'aventure a déjà été importée, et que c'est une nouvelle version, effectue la mise à jour incrémentale en fonction de la version
    if (foundry.utils.isNewerVersion(this.systems[systemId].adventureVersion, installedAdventureVersion)) {
      //await Updates.updateAll(installedAdventureVersion)
      ui.notifications.warn(
        "L'aventure a été mise à jour vers la version " +
          this.systems[systemId].adventureVersion +
          " . Vous pouvez réimporter l'aventure pour bénéficier des nouveautés. La carte de l'Hibernie et les 10 adversaires de l'aide de jeu.",
        { permanent: true }
      )
      game.settings.set(this.moduleId, SETTINGS.SETTING_ADVENTURE_VERSION, this.systems[systemId].adventureVersion)
    }
  }

  /**
   * @description Affiche la fenêtre d'import de l'aventure
   */
  async _adventureImportDisplay(systemId) {
    const adventurePack = await game.packs.get(this.systems[systemId].adventurePackName)
    const adventureId = await adventurePack.index.find((a) => a.name === this.systems[systemId].adventurePackLabel)?._id
    const adventure = await adventurePack.getDocument(adventureId)
    await adventure.sheet.render(true)
  }

  /**
   * @description Importe l'aventure
   * Prend en paramètre les informations du Hook importAdventure
   * @param {*} adventure
   * @param {*} created
   * @param {*} updated
   * @returns
   */
  async adventureImport(systemId, adventure, created, updated) {
    console.log("adventureImport", systemId, adventure, created, updated)
    if (this.systems[systemId].adventureId === adventure._id) {
      if (created || updated) {
        game.settings.set(this.moduleId, SETTINGS.SETTING_IMPORTED, true)
        game.settings.set(this.moduleId, SETTINGS.SETTING_ADVENTURE_VERSION, this.systems[systemId].adventureVersion)

        if (foundry.utils.hasProperty(created, "Scene") || foundry.utils.hasProperty(updated, "Scene")) {
          ui.notifications.info("Attendez la fin de l'importation de toutes les scènes !", { permanent: true })
          await this.createThumbs(adventure)
        }

        let welcomeJournal = game.journal.get(this.systems[systemId].welcomeJournalEntryId)
        if (welcomeJournal) welcomeJournal.sheet.render(true, { sheetMode: "text" })
        ui.notifications.info("Importation de l'aventure terminée !", { permanent: true })
        return
      } else {
        ui.notifications.warn("Il y a eu un problème lors de l'importation de l'aventure !", { permanent: true })
      }
    }
  }

  async createThumbs(adventure) {
    let updates = []
    for (let scene of adventure.scenes) {
      let sceneId = scene._id
      let sceneImported = game.scenes.get(sceneId)
      const { thumb } = await sceneImported.createThumbnail()
      updates.push({
        _id: scene.id,
        thumb,
      })
    }
    Scene.updateDocuments(updates)
  }

  /**
   * @description Enregistre les settings spécifiques à la gestion du module et de l'aventure
   */
  registerSettings() {
    game.settings.register(this.moduleId, SETTINGS.SETTING_IMPORTED, {
      name: "Aventure importée",
      scope: "world",
      config: false,
      type: Boolean,
      default: false,
    })

    game.settings.register(this.moduleId, SETTINGS.SETTING_MODULE_VERSION, {
      name: "Version du module",
      scope: "world",
      config: false,
      type: String,
      default: "0",
    })

    game.settings.register(this.moduleId, SETTINGS.SETTING_ADVENTURE_VERSION, {
      name: "Version de l'aventure",
      scope: "world",
      config: false,
      type: String,
      default: "0",
    })
  }
}
