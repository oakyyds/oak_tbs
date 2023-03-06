import { describe, test } from '@jest/globals';
import { list } from './index';

describe('test yande.re', () => {
  test('list', () => {
    const ret = list({ page: 1, limit: 5 });
    console.log(ret);
  });
});
