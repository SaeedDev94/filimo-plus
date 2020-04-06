const axios = require('axios').default;

const FilimoHelper = {
  friendlyName: 'Filimo',
  description: 'Get content from filimo.com',
  client: null,
  inputs: {
    requestHeaders: {
      type: {},
      description: 'client request headers',
      required: true
    },
    responseType: {
      type: 'string',
      description: 'response type',
      required: true
    },
    method: {
      type: 'string',
      description: 'the method of http call (ex: get, post)',
      required: true
    },
    path: {
      type: 'string',
      description: 'target path to send request',
      required: true
    },
    body: {
      type: {},
      description: 'post request body',
      required: false
    },
    params: {
      type: {},
      description: 'get query string',
      required: false
    }
  },
  exits: {
    success: {
      description: 'Http call done and was successful'
    },
    error: {
      description: 'Somethings went wrong during http call'
    }
  },
  init: (responseType, requestHeaders) => {
    const jwtToken = requestHeaders['jwt-token'] || '';
    const defaultUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36';
    const userAgent = requestHeaders['user-agent'] || defaultUserAgent;
    const headers = {
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Host': 'www.filimo.com',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': userAgent
    };
    if (jwtToken) {
      headers['Cookie'] = `AuthV1=${jwtToken};`;
    }
    FilimoHelper.client = axios.create({
      baseURL: 'https://www.filimo.com',
      headers,
      responseType
    });
  },
  fn: async (inputs, exits) => {
    FilimoHelper.init(inputs.responseType, inputs.requestHeaders);
    try {
      let result;
      if (inputs.method === 'get') {
        const params = inputs.params || {};
        result = await FilimoHelper.client.get(inputs.path, params);
      } else if (inputs.method === 'post') {
        const body = inputs.body || {};
        result = await FilimoHelper.client.post(inputs.path, body);
      }
      return exits.success(result);
    } catch (details) {
      return exits.error(details);
    }
  }
};

module.exports = FilimoHelper;
