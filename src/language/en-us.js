export const textEnglishUS = {
  base: {
    exportedLogMessage: (objects) => `${Array.isArray(objects) ? `${objects.length} objects have`: 'Object has'} been exported and copied to clipboard!`,
    importedLogMessage: (objects) => `Imported ${objects.length} objects from clipboard!`,
    deletedAllLogMessage: (objects) => `Deleted ${objects.length} objects!`,
    exportButtonText: 'Export',
    copiedButtonMessage: 'Copied!',
    importFailedAlert: (process) => `Validation failed while ${process}`,
    importFailedParsingAlert: 'The object could not be parsed. Make sure to copy a valid JSON string to clipboard.',
    confirmImportRequestText: (o) => `Do you really want to import ${Array.isArray(o) ? `${o.length} objects`: 'the object'}?`,
    confirmDeleteRequestText: (o) => `Do you really want to delete ${o}?`,
    importAbortedLog: 'Import aborted by user.',
  },
  auth: {
    unknownServerError: 'An unknown error occurred',
  }
}
