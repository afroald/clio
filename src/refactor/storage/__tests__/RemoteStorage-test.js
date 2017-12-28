/* eslint-env node, jest */

const { Readable } = require('stream');
const { ReadableStreamBuffer, WritableStreamBuffer } = require('stream-buffers');
const streamToArray = require('stream-to-array');

const MockConnection = require('../../connection/MockConnection');
const RemoteStorage = require('../RemoteStorage');

const lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus, erat sed iaculis feugiat, velit metus ullamcorper augue, vel hendrerit lacus nisi accumsan nibh. Sed maximus scelerisque tortor, sed imperdiet nibh accumsan ac. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque ipsum neque, porta a mollis id, varius vel tortor. Nulla sit amet interdum nibh, nec semper erat. Praesent fermentum elementum tellus, non venenatis nisi congue non. Quisque dui augue, sodales sed rhoncus non, pharetra eu tellus. Maecenas tincidunt ullamcorper faucibus. Quisque malesuada iaculis commodo. Curabitur imperdiet pellentesque tincidunt. Morbi a velit eros. Ut luctus, erat non luctus bibendum, mauris nulla rhoncus nulla, at semper tellus nunc ac est. Nam dignissim purus vel massa facilisis, a semper nibh tincidunt.';
const lipsumBuffer = Buffer.from(lipsum, 'utf8');

describe('RemoteStorage', () => {
  let connection = null;
  let testReadStream = null;
  let testWriteStream = null;
  let storage = null;

  beforeEach(() => {
    testReadStream = new ReadableStreamBuffer();
    testWriteStream = new WritableStreamBuffer();

    connection = new MockConnection({
      createReadStream() {
        return Promise.resolve(testReadStream);
      },

      createWriteStream() {
        return Promise.resolve(testWriteStream);
      },
    });

    storage = new RemoteStorage(connection);
  });

  describe('read', () => {
    it('returns a buffer from a connection read stream', (done) => {
      expect.assertions(2);

      storage.read('/test/path').then((fileBuffer) => {
        expect(fileBuffer).toBeInstanceOf(Buffer);
        expect(fileBuffer.toString('utf8')).toEqual(lipsum);
        done();
      });

      testReadStream.put(lipsumBuffer);
      testReadStream.stop();
    });

    it('rejects when connection read stream fails', (done) => {
      expect.assertions(1);

      storage.read('/test/path').catch((error) => {
        expect(error).toBeInstanceOf(Error);
        done();
      });

      testReadStream.destroy(new Error('Test error'));
    });
  });

  describe('createReadStream', () => {
    it('passes data from connection read stream to returned stream', async (done) => {
      expect.assertions(2);

      const readStream = await storage.createReadStream('/test/path');
      expect(readStream).toBeInstanceOf(Readable);

      streamToArray(readStream).then((buffers) => {
        const buffer = Buffer.concat(buffers);
        expect(buffer.equals(lipsumBuffer)).toBe(true);
        done();
      });

      testReadStream.put(lipsumBuffer);
      testReadStream.stop();
    });
  });

  describe('write', () => {
    it('passes a read stream to connection', async () => {
      await storage.write('/test/path', lipsumBuffer);
      const data = testWriteStream.getContents();
      expect(data.equals(lipsumBuffer)).toBe(true);
    });
  });

  describe('createWriteStream', () => {
    it('returns a write stream returned by connection', async () => {
      const writeStream = await storage.createWriteStream('/test/path');
      expect(writeStream).toBe(testWriteStream);
    });
  });
});
