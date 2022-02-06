import ExportImport from "../../data/ExportImport";
import {AccountController} from "./account.controller";

export const Messages = (key) => ({
  notifications: {
    isCopied: `Copied ${key}s to clipboard!`,
    importSuccessful: `imported {n} ${key}s`,
  },
  alerts: {
    confirmImport: `Do you want to import {n} ${key}s from clipboard?`,
    confirmDelete: `Do you want to delete all ${key}s?`,
  },
  errors: {
    notAnArray: `Import ist not an array.`,
    couldNotParse: `Could not parse imported text.`,
    validationFailed: `The validation of the elements with failed: {list}`,
  },
});

const configAccount = {
  messages: Messages('account'),
  controller: AccountController,
}

export function AccountExportImport () {
  return <ExportImport config={configAccount} />;
}

