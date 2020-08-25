const LoginController = {
  firstStep: async (req, res) => {
    try {
      const account = req.body.account || '';
      const otp = Boolean(req.body.otp);
      const result = await sails.helpers.filimo.with({
        method: 'get',
        path: '/signin',
        requestHeaders: req.headers,
        responseType: 'text'
      });
      const html = result.data || '';
      const matches = [...html.matchAll(/guid: "(.*)"/g)];
      if (!matches[0] || !matches[0][1]) {
        return res.json({
          status: 500,
          success: false,
          message: 'Guid not found',
          data: {}
        });
      }
      const guid = matches[0][1];
      const authResponse = await sails.helpers.filimo.with({
        method: 'post',
        path: '/api/fa/v1/user/Authenticate/auth',
        requestHeaders: req.headers,
        responseType: 'json',
        body: {
          guid
        }
      });
      let tempId = authResponse.data.data.attributes.temp_id;
      const firstStepResponse = await sails.helpers.filimo.with({
        method: 'post',
        path: '/api/fa/v1/user/Authenticate/signin_step1',
        requestHeaders: req.headers,
        responseType: 'json',
        body: {
          guid,
          'temp_id': tempId,
          'codepass_type': (otp) ? 'otp' : 'pass',
          account
        }
      });
      tempId = firstStepResponse.data.data.attributes.temp_id;
      return res.json({
        status: firstStepResponse.status || 0,
        success: true,
        message: firstStepResponse.statusText || '',
        data: {
          guid,
          tempId
        }
      });
    } catch (error) {
      const errorBody = error.response.data || {};
      const errors = errorBody.errors || [];
      const lastError = errors[errors.length - 1] || {};
      return res.json({
        status: error.status || 0,
        success: false,
        message: lastError.detail || error.message || '',
        data: error
      });
    }
  },
  secondStep: async (req, res) => {
    const otp = Boolean(req.body.otp);
    const body = {
      guid: req.body.guid || '',
      'temp_id': req.body.tempId || '',
      account: req.body.account || '',
      code: req.body.pass || '',
      'codepass_type': (otp) ? 'otp' : 'pass'
    };
    try {
      const secondStepResponse = await sails.helpers.filimo.with({
        method: 'post',
        path: '/api/fa/v1/user/Authenticate/signin_step2',
        requestHeaders: req.headers,
        responseType: 'json',
        body
      });
      const token = secondStepResponse.data.data.attributes.token;
      return res.json({
        status: secondStepResponse.status || 0,
        success: true,
        message: secondStepResponse.statusText || '',
        data: {
          token
        }
      });
    } catch (error) {
      const statusCode = error.response.status || 0;
      const errorBody = error.response.data || {};
      const errors = errorBody.errors || [];
      const lastError = errors[errors.length - 1] || {};
      if (statusCode === 403 && errorBody.errors) {
        const maxDevices = errorBody.errors.find(item => item.type_info === 'get_max_tokens');
        const forceOtp = errorBody.errors.find(item => item.type_info === 'force_mobile_signin');
        if (maxDevices) {
          return await LoginController.logoutLastDevice(body.guid, errorBody.errors[0].uri, req, res);
        }
        if (forceOtp) {
          lastError.detail = 'ورود با رمز عبور امکان پذیر نیست، ورود با پیامک را امتحان کنید';
        }
      }
      return res.json({
        status: statusCode,
        success: false,
        message: lastError.detail || error.message || '',
        data: error
      });
    }
  },
  logoutLastDevice: async (guid, uri, req, res) => {
    try {
      const sessionsListResponse = await sails.helpers.filimo.with({
        method: 'get',
        path: `/${uri}`,
        requestHeaders: req.headers,
        responseType: 'json',
        params: {
          guid
        }
      });
      const sessionsList = sessionsListResponse.data.data.attributes.data;
      let lastSessionKey = '';
      for (const key in sessionsList) {
        lastSessionKey = key;
      }
      const revokeLink = sessionsList[lastSessionKey].revoke_link;
      const revokeSessionResponse = await sails.helpers.filimo.with({
        method: 'get',
        path: `/${revokeLink}`,
        requestHeaders: req.headers,
        responseType: 'json',
        params: {
          guid
        }
      });
      const loginLink = revokeSessionResponse.data.data.attributes.uri;
      const loginResponse = await sails.helpers.filimo.with({
        method: 'get',
        path: `/${loginLink}`,
        requestHeaders: req.headers,
        responseType: 'json',
        params: {
          guid
        }
      });
      const token = loginResponse.data.data.attributes.token;
      return res.json({
        status: loginResponse.status || 0,
        success: true,
        message: loginResponse.statusText || '',
        data: {
          token
        }
      });
    } catch (error) {
      return res.json({
        status: error.status || 0,
        success: false,
        message: error.message || '',
        data: error
      });
    }
  },
  logout: async (req, res) => {
    try {
      await sails.helpers.filimo.with({
        method: 'get',
        path: '/authentication/authentication/signout',
        requestHeaders: req.headers,
        responseType: 'text'
      });
    } catch (error) {
      console.error('LoginController#logout', error);
    }
    return res.json({
      status: 200,
      success: true,
      message: 'OK',
      data: {}
    });
  }
};

module.exports = LoginController;
