module.exports = {
  port: 3005,
  verbose: true,
  handlers: {
    'GET /': {
      status: 200
    },
    'POST /auth/v1/private/check': {
      status: 200,
      data: {
        rights: [ 'VIEW_USER', 'CREATE_USER', 'SUPERADMIN' ]
      }
    },
    'POST auth/v1/private/break': {
      status: 200
    },
    'GET auth/v1/private/test': req => {
      console.log(req.headers);
      return {
        status: 200,
        headers: {
          'x-csrf-token': 'hello-mydearworld'
        }
      }
    }
  }
}