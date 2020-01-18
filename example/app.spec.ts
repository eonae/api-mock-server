import app from './app';
import { MockServer } from '../src';
import { RequestSender } from '../src';

const apiMock = new MockServer({
  port: 5001,
  verbose: false
});

const sender = new RequestSender(app);

describe('One way', () => {
  it('should return data if permissions server returns 200', done => {
    // First we tell mock server to reply with 200 to POST /permissions request.
    // This reply is not persistent, which means after this request handler will be removed from
    // mock server.
    // If there are no more handlers mock server is automatically stopped;
    apiMock
      .pushResponse('POST', '/permissions', { status: 200 })
      // We could push more responses or response handlers if we need more complex logic
      // .pushResponse('POST', '/some_other_url', { status: 500 })
      // .pushHandler('GET', '/calculate', req => {
      //   ...some logic with request data
      //   return { status: 200, data: some }
      // })
      .listen();

      // TODO: unclutter this. Listen is async so it could work bad in some cases.

    // Now we can start our supertest request;
    sender.sendRequest('POST', '/data', { data: { username: 'Bill'}})
      .expect(200)
      .expect(res => {
        if (!res.body.data) throw new Error('No data received');
      })
      .end(done);
  });

  it('should return 403 `Forbidden` if permissions server returns 403', done => {
    apiMock
      .pushResponse('POST', '/permissions', { status: 403 })
      .listen();

    sender.sendRequest('POST', '/data', { data: { username: 'Jill' }})
      .expect(403)
      .expect(res => {
        if (res.body.data) throw new Error('Some data was received');
      })
      .end(done);
  });

  it('should return 500 `External api unreachable` if external api is offline', done => {
    // just don't start mockServer
    sender.sendRequest('POST', '/data', { data: { username: 'Bill '}})
      .expect(500)
      .expect(res => {
        if (res.body.data) throw new Error('Some data was received');
      })
      .end(done);
  })
})

describe('Another way', () => {
  before(done => {
    // You either can register more complex persistent handler
    apiMock.pushHandler('POST', '/permissions', req => {
      if (req.body.username === 'Bill') return { status: 200 };
      else return { status: 403 };
    }, { persistent: true }).listen().then(done);
  });

  after(done => {
    apiMock.stop().then(done);
  });

  it('should return 200 if username is Bill', done => {
    sender.sendRequest('POST', '/data', { data: { username: 'Bill'} })
      .expect(200, done);
  });

  it('should return 403 if username is Jill', done => {
    sender.sendRequest('POST', '/data', { data: { username: 'Jill' } })
      .expect(403, done);
  });
})