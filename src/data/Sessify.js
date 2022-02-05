import Cookies from "universal-cookie";

export default class Sessify {

  static cookies = new Cookies();

  static has(keys) {

    // check if all cookies exist
    return keys.reduce((b, key) => {
      return b && Sessify.cookies.get(key) !== undefined;
    }, true)

  }

  static create(values, options) {

    // save cookies
    Object.keys(values).forEach((key) => {
      this.cookies.set(key, values[key], options);
    });

  }

  static createTokens(values) {

    // save cookies
    Object.keys(values).forEach((key) => {

      // get data
      let token = values[key].token;
      let expires = values[key].expires;

      // save cookie
      this.cookies.set(key, token, {expires: new Date(expires)});

    });

  }

  static remove(keys) {

    // make single key to array
    Array.isArray(keys) || (keys = [keys]);

    // delete all keys
    keys.forEach((key) => {
      this.cookies.remove(key);
    })

  }


  static get(keys) {

    return Object.fromEntries(
      new Map(keys
        .map(e => ([e, this.cookies.get(e)]))
        .filter(e => e[1] !== undefined)
      )
    );

  }

  static removeCookie(key) {

    // delete all keys
    this.cookies.remove(key);

  }

  static getCookie(key) {
    return new Promise((resolve, reject) => {

      // get cookie
      let cookie = this.cookies.get(key);

      // check if cookie exists
      if (cookie === undefined)
        reject("session_not_found");

      // return on success
      resolve(cookie);

    });
  }


  static createToken(key, obj) {

    // save cookie
    this.cookies.set(key, obj.token, {expires: new Date(obj.expires)});

  }


  static getSingle(key) {

    return new Promise((resolve, reject) => {

      if (Array.isArray(key)) {

        let result = {}
        key.forEach((e) => {
          let c = this.cookies.get(e);
          c && (result[e] = c);
        });

        // return result
        resolve(result);

      } else {

        // get cookie
        let cookie = this.cookies.get(key);

        // check if cookie exists
        if (cookie === undefined)
          reject();

        // return on success
        resolve(cookie);

      }

    });

  }


}




