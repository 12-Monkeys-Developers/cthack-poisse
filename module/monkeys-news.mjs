import * as SETTINGS from "./constants.mjs"

export default class MonkeysNews {
  constructor() {
    this.moduleId = null
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
   * @description Récupère les news du repo et l'affiche dans le chat
   */
  sendChatMessage() {
    if (game.user.isGM) {
      const moduleId = this.moduleId

      // Récupération de la news
      let jqxhr = $.getJSON(SETTINGS.MESSAGE_URL, function (data) {
        // Version de la dernière news affichée
        let latestNewsVersion = game.settings.get(moduleId, SETTINGS.SETTING_MONKEYS_MESSAGE_VERSION)

        if (data.messages === undefined || data.messages === null || data.messages.length === undefined) {
          return
        }

        for (let i = 0; i < data.messages.length; i++) {
          let news = data.messages[i]
          if (news.version > latestNewsVersion) {
            ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ alias: "News des 12 Singes" }),
              whisper: [game.user],
              content: news.message,
            })
            latestNewsVersion = Math.max(latestNewsVersion, news.version)
            console.log("News des 12 Singes - Version mise à jour vers la version " + latestNewsVersion)
            game.settings.set(moduleId, SETTINGS.SETTING_MONKEYS_MESSAGE_VERSION, latestNewsVersion)
          }
        }
      }).fail(function (data) {
        console.log("Impossible de récupérer les news : " + JSON.stringify(data))
      })
    }
  }

  /**
   * @description Enregistre le setting utilisé pour la version de la news
   */
  registerSettings() {
    game.settings.register(this.moduleId, SETTINGS.SETTING_MONKEYS_MESSAGE_VERSION, {
      name: "Nouvelles des 12 Singes",
      hint: "Pour notifier des dernières nouvelles des 12 Singes",
      scope: "world",
      config: false,
      type: Number,
      default: 0,
    })
  }
}
