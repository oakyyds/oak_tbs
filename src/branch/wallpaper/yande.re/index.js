import dayjs from 'dayjs';

function format(size) {
  const kb = 1024;
  const mb = kb * 1024;
  if (size > mb) {
    return (size / mb).toFixed(2) + 'MB';
  }
  return Math.floor(size / kb) + 'KB';
}

const ratingMap = {
  'e': 'Explicit',
  'q': 'Questionable',
  's': 'Safe',
};

const langMap = {
  'author': ['Author', '作者'],
  'size': ['Size', '尺寸'],
  'file_size': ['File Size', '文件大小'],
  'source': ['Source', '来源'],
  'score': ['Score', '评分'],
  'rating': ['Rating', '等级'],
  'created_at': ['Created At', '创建时间'],
  'updated_at': ['Updated At', '更新时间'],
};

const langs = ['en', 'zh'];

export function list(args) {
  const { url, overrides, lang } = args;
  let rawUrl = url;
  if (overrides) {
    const newUrl = new URL(url);
    if (overrides.hasOwnProperty('page')) {
      newUrl.searchParams.set('page', overrides.page);
    }
    if (overrides.hasOwnProperty('limit')) {
      newUrl.searchParams.set('limit', overrides.limit);
    }
    if (overrides.hasOwnProperty('query')) {
      for (const key in overrides.query) {
        newUrl.searchParams.set(key, overrides.query[key]);
      }
    }
    if (overrides.hasOwnProperty('appendQuery')) {
      for (const key in overrides.query) {
        newUrl.searchParams.set(key, overrides.query[key]);
      }
    }
    rawUrl = newUrl.toString();
  }
  const { data } = httpCall(rawUrl);
  const list = [];
  if (data && data.length) {
    let langIndex = langs.indexOf(lang);
    if (langIndex < 0) {
      langIndex = 0;
    }
    const tagUrl = new URL(url);
    tagUrl.searchParams.set('page', '1');
    for (const datum of data) {
      const tags = datum.tags.split(' ').map(tag => {
        const url = tagUrl.toString();
        tagUrl.searchParams.set('tags', tag);
        return { tag, url, action: 'search' };
      });
      const info = [
        {
          label: langMap['author'][langIndex],
          text: datum.author,
          style: 'inline'
        },
        {
          label: langMap['size'][langIndex],
          text: `${datum.width}×${datum.height}`,
          style: 'inline'
        },
        {
          label: langMap['file_size'][langIndex],
          text: `${format(datum.file_size)}`,
          style: 'inline'
        },
        {
          label: langMap['source'][langIndex],
          text: datum.source || null,
          url: datum.source || null,
        },
        {
          label: langMap['score'][langIndex],
          text: `${datum.score}`,
          style: 'inline'
        },
        {
          label: langMap['rating'][langIndex],
          text: `${ratingMap[datum.rating] || 'Unknown'}`,
          style: 'inline'
        },
        {
          label: langMap['created_at'][langIndex],
          text: dayjs(datum.created_at * 1000).format('YYYY-MM-DD HH:mm:ss'),
          style: 'inline'
        },
        {
          label: langMap['updated_at'][langIndex],
          text: datum.updated_at ? dayjs(datum.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss') : null,
          style: 'inline'
        }
      ].filter((e) => !!e.text);
      list.push({
        preview: datum.sample_url || datum.jpeg_url,
        url: datum.file_url || datum.jpeg_url || datum.sample_url,
        info,
        id: datum.id.toString(),
        tags
      });
    }
  }
  const nextUrl = new URL(rawUrl);
  const page = parseInt(nextUrl.searchParams.get('page'));
  nextUrl.searchParams.set('page', (page + 1).toString());
  return {
    list,
    next: nextUrl.toString(),
  };
}
