/* eslint-env node, jest */

const fs = require('fs');
const path = require('path');
const { ReadableStreamBuffer } = require('stream-buffers');
const streamToArray = require('stream-to-array');
const { Readable, Writable } = require('stream');

const FileStorage = require('../FileStorage');
const Storage = require('../Storage');

const lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus, erat sed iaculis feugiat, velit metus ullamcorper augue, vel hendrerit lacus nisi accumsan nibh. Sed maximus scelerisque tortor, sed imperdiet nibh accumsan ac. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque ipsum neque, porta a mollis id, varius vel tortor. Nulla sit amet interdum nibh, nec semper erat. Praesent fermentum elementum tellus, non venenatis nisi congue non. Quisque dui augue, sodales sed rhoncus non, pharetra eu tellus. Maecenas tincidunt ullamcorper faucibus. Quisque malesuada iaculis commodo. Curabitur imperdiet pellentesque tincidunt. Morbi a velit eros. Ut luctus, erat non luctus bibendum, mauris nulla rhoncus nulla, at semper tellus nunc ac est. Nam dignissim purus vel massa facilisis, a semper nibh tincidunt.';
const testFile = path.resolve(__dirname, 'test.tmp');

describe('FileStorage', () => {
  let storage;

  async function deleteTestFile() {
    try {
      await storage.delete(testFile);
    } catch (error) {} // eslint-disable-line no-empty
  }

  beforeEach(() => {
    storage = new FileStorage(path.resolve(__dirname));
  });

  afterEach(async () => {
    await deleteTestFile();
  });

  it('is an instance of Storage', () => {
    expect(storage).toBeInstanceOf(Storage);
  });

  it('writes files', async () => {
    expect.assertions(2);

    await expect(storage.write(testFile, lipsum)).resolves.toBeUndefined();

    expect(() => {
      fs.statSync(path.resolve(__dirname, testFile));
    }).not.toThrow();
  });

  it('reads files', async () => {
    await storage.write(testFile, lipsum);

    const data = await storage.read(testFile);
    expect(data.toString()).toEqual(lipsum);
  });

  it('provides a read stream', async () => {
    await storage.write(testFile, lipsum);

    const stream = storage.readStream(testFile);
    expect(stream).toBeInstanceOf(Readable);
    const data = Buffer.concat(await streamToArray(stream));
    expect(data.toString()).toEqual(lipsum);
  });

  it('provides a write stream', (done) => {
    expect.assertions(2);

    const buffer = Buffer.from(lipsum, 'utf-8');
    const readStream = new ReadableStreamBuffer();
    const writeStream = storage.writeStream(testFile);
    expect(writeStream).toBeInstanceOf(Writable);

    readStream.pipe(writeStream);

    readStream.on('end', () => {
      storage.read(testFile).then((data) => {
        expect(data.toString()).toEqual(lipsum);
        done();
      });
    });

    readStream.put(buffer);
    readStream.stop();
  });

  it('deletes files', async () => {
    await storage.write(testFile, lipsum);

    expect(() => {
      fs.statSync(path.resolve(__dirname, testFile));
    }).not.toThrow();

    await storage.delete(testFile);

    expect(() => {
      fs.statSync(path.resolve(__dirname, testFile));
    }).toThrow();
  });

  it("won't overwrite files", async () => {
    expect.assertions(2);

    await storage.write(testFile, lipsum);

    try {
      await storage.write(testFile, lipsum);
    } catch (error) {
      expect(error).toEqual(expect.objectContaining({
        code: 'EEXIST',
      }));
    }

    try {
      await (() => new Promise((resolve, reject) => {
        const stream = storage.writeStream(testFile);
        stream.on('error', reject);
      }))();
    } catch (error) {
      expect(error).toEqual(expect.objectContaining({
        code: 'EEXIST',
      }));
    }
  });
});
