export default class Restify {

  constructor(url) {
    this.url = String(url);
    this.token = null;
  }

  setAccessToken(token) {
    this.token = token;
  }

  unsetAccessToken() {
    this.token = null;
  }

  get(config) {
    config = (config || {});
    return this.request({
      ...{method: 'GET'},
      ...config,
    });
  }

  post(data, config) {
    return this.request({
      ...{method: 'POST', body: JSON.stringify(data)},
      ...config,
    })
  }

  patch(data, config) {
    return this.request({
      ...{method: 'PATCH', body: JSON.stringify(data)},
      ...config,
    })
  }

  delete(config) {
    return this.request({
      ...{method: 'DELETE', json: false},
      ...config,
    });
  }

  request = (config) => {

    // create headers
    let headerConf = config.headers || {"Content-Type": "application/json"};

    // get keys
    let keys = config.keys || {};

    // get token (config, saved)
    let token = config.token || (this.token || null);
    delete config.token;

    if(token) {

      // write to header
      headerConf.Authorization = `Bearer ${token}`

      // parse token
      let parsed = Restify.parseJwt(token);

      // get keys from config and add user id
      keys.this_user_id = parsed.sub
      delete config.keys;

    }

    // set json flag
    let json = config.json === undefined ? true : config.json;
    delete config.json;

    // update headers
    config.headers = new Headers(headerConf);

    // add params to url
    let url = new URL(this.url);
    url.search = new URLSearchParams(config.params || {}).toString();
    delete config.params;

    // add custom path and replace placeholders
    config.path && (url.pathname = url.pathname + config.path);
    keys && (Object.keys(keys).forEach((e) => {
      url.pathname = url.pathname.replace('%' + e + '%', keys[e])
    }));

    // return this promise
    return fetch(url.toString(), config)
        .then((response) => {
          // parse response
          if(!response)
            return Promise.reject({status: -1, message: "Server did not respond."})
          else if(!response.ok)
            return response.json()
              .then((content) => {
                response.content = content;
                return Promise.reject(response);
              })
              .catch(() => Promise.reject(response))
          else if (response.ok && response?.statusText === "No Content")
            return true;

          // otherwise
          return json ? response.json() : response;

        });

  }

  static parseJwt = (token) => {

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);

  };


}
