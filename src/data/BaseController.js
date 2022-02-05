export const copyFromBaseObject = (base, content) => {
  // create empty object
  const obj = {};
  // copy each key
  Object.keys(base).forEach((key) => obj[key] = content[key]);
  // return object
  return obj;
}


export function ControllerMethods(rest, newInstance, parent, token) {
  // if parent not set, set to empty object
  parent = parent || {};
  // errors
  if(rest === null)
    throw new Error('Rest object must not be null');
  // return methods
  return {
    get: (id) => rest.get({params: parent, path: '/' + id, token}),
    getList: (params) => rest.get({params: {...parent, ...params}, token}),
    getAll: () => rest.get({params: parent, path: '/batch', token}),
    create: (object) => rest.post({...object, ...parent}, {token}),
    createMany: (objects) => rest.post(objects, {params: parent, path: '/batch', token}),
    save: (id, object) => rest.patch(object, {path: '/' + id, token}),
    delete: (id) => rest.delete({path: '/' + id, token}),
    deleteAll: () => rest.delete({params: parent, path: '/batch', token}),
    instantiate: () => ({...newInstance, ...parent}),
    beforeCreate: (o) => copyFromBaseObject(newInstance, o),
    beforeEdit: (o) => copyFromBaseObject(newInstance, o),
    beforeUpdate: (o) => copyFromBaseObject(newInstance, o),
    beforeExport: (o) => copyFromBaseObject(newInstance, o),
    beforeImport: (o) => copyFromBaseObject(newInstance, o),
  }
}


export function ControllerMessages(label, plural) {
  // return methods
  return {
    saveFailed: `Could not save ${label}:`,
    createFailed: `Could not create ${label}:`,
    deleteFailed: `Could not delete ${label}:`,
    unknownError: `Something cheesy is going on here, sorry.`,
    formTitle: (obj) => !!obj ? `Edit ${label}` : `Create new ${label}`,
    deleteConfirmationRequest: `Do you really want to delete the ${label}?`,
    deleteAllConfirmationRequest: `Do you want to delete all ${plural}?`,
    emptyList: `No ${plural}.`,
    noOfElements: (n) => `A total of ${n} ${plural} in list.`,
    importIsNotAnArray: `Import ist not an array.`,
    couldNotParseImport: `Could not parse imported text.`,
    importValidationFailed: `The validation of the elements with failed: {list}`,
    importConfirmationRequest: `Do you want to import {n} ${plural} from clipboard?`,
    importSuccessful: `imported {n} ${plural}`,
    exportIsCopied: (n) => `Copied ${n} ${plural} to clipboard!`,
  }
}


export default class BaseController {

  callbacks = {};

  registerRefreshCallback(key, callback) {
    // add to objects
    this.callbacks[key] = callback;
  }

  unregisterRefreshCallback(key) {
    // remove
    delete this.callbacks[key];
  }

  refresh() {
    // call callbacks
    Object.values(this.callbacks).map(cb => cb());
  }

}
