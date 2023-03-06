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

export function list(args) {
  const { page, limit, params } = args || {};
  const currPage = page || 1;
  const pageSize = limit || 20;
  const query = {
    limit: pageSize,
    page: currPage,
    tags: params || 'rating:safe'
  };
  const { data } = httpCall({ url: 'https://yande.re/post.json', query });
  const list = [];
  if (data) {
    for (const datum of data) {
      const tags = datum.tags.split(' ').map(tag => ({ tag }));
      list.push({
        preview: datum.sample_url || datum.jpeg_url,
        url: datum.file_url || datum.jpeg_url || datum.sample_url,
        display: [
          {
            label: 'Author',
            text: datum.author,
            style: 'inline'
          },
          {
            label: 'Size',
            text: `${datum.width}×${datum.height}`,
            style: 'inline'
          },
          {
            label: 'File Size',
            text: `${format(datum.file_size)}`,
            style: 'inline'
          },
          {
            label: 'Source',
            text: datum.source || null,
            url: datum.source || null,
          },
          {
            label: 'Score',
            text: `${datum.score}`,
            style: 'inline'
          },
          {
            label: 'Rating',
            text: `${ratingMap[datum.rating] || 'Unknown'}`,
            style: 'inline'
          },
          {
            label: 'Created At',
            text: datum.created_at,
            style: 'inline'
          },
          {
            label: 'Updated At',
            text: datum.updated_at,
            style: 'inline'
          }
        ],
        id: datum.id,
        tags: tags
      });
    }
  }
  return {
    page: currPage,
    limit: pageSize,
    list,
  };
}
