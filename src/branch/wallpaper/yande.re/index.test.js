import { describe, test } from '@jest/globals';
import { list } from './index';

describe('test yande.re', () => {
  test('list', () => {
    const ret = list({ url: 'https://yande.re/post.json?tags=rating:safe&limit=10&page=1' });
    console.log(JSON.stringify(ret));
  });
  test('override', () => {
    const ret = list({
      url: 'https://yande.re/post.json?tags=rating:safe&limit=10&page=1', overrides: {
        page: 3,
        limit: 1,
        query: {
          tags: ''
        }
      }
    });
    console.log(JSON.stringify(ret));
  });
  test('translate', () => {
    let ret = list({ url: 'https://yande.re/post.json?tags=rating:safe&limit=10&page=1', lang: 'en' });
    console.log(JSON.stringify(ret));
    ret = list({ url: 'https://yande.re/post.json?tags=rating:safe&limit=10&page=1', lang: 'zh' });
    console.log(JSON.stringify(ret));
  });
});
