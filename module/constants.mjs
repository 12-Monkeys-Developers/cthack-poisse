export const SETTING_IMPORTED = "imported"
export const SETTING_MODULE_VERSION = "moduleVersion"
export const SETTING_ADVENTURE_VERSION = "adventureVersion"
export const SETTING_MONKEYS_MESSAGE_VERSION = "monkeysMessageVersion"

export const LOG_HEADER = "CTHULHU HACK Module Perdus dans la poisse | "
export const LOG_HEADER_UPDATE_MODULE = "Mise à jour du module vers la version "

export const MODULE_ID = "cthack-poisse"
export const MODULE_NAME = "Perdus dans la poisse"

// TODO : Set the adventure id
export const ADVENTURE_ID = "mZbPFA1uVvL4WoSN"
// TODO : Set the journal entry id
export const WELCOME_JOURNAL_ENTRY_ID = "dUcYjaxFcmnaS0cO" // The Id a journal entry to display after import.

export const MODULE_VERSION = "1.0.0"
export const ADVENTURE_VERSION = "1.0.0"

export const SYSTEM_ID = "cthack"

export const SYSTEMS = {
  cthack: {
    adventurePackName: "cthack-poisse.poisse",
    adventureId: ADVENTURE_ID,
    systemName: SYSTEM_ID,
    adventureVersion: ADVENTURE_VERSION,
    adventurePackLabel: MODULE_NAME,
    welcomeJournalEntryId: WELCOME_JOURNAL_ENTRY_ID,
  },
}

export const MESSAGE_URL = "https://raw.githubusercontent.com/12-Monkeys-Developers/news-messages/main/messages.json"

export const CONSTANTS = {
  SETTING_IMPORTED,
  SETTING_MODULE_VERSION,
  SETTING_ADVENTURE_VERSION,
  SETTING_MONKEYS_MESSAGE_VERSION,
  LOG_HEADER,
  LOG_HEADER_UPDATE_MODULE,
  MODULE_ID,
  MODULE_NAME,
  ADVENTURE_ID,
  WELCOME_JOURNAL_ENTRY_ID,
  MODULE_VERSION,
  ADVENTURE_VERSION,
  SYSTEMS,
  MESSAGE_URL,
  SYSTEM_ID,
}
