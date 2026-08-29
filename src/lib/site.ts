export function withBase(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const repository = typeof process === 'undefined' ? undefined : process.env.GITHUB_REPOSITORY?.split('/')[1];
  const configuredBase = typeof process === 'undefined' ? undefined : process.env.BASE_PATH;
  const environmentBase = import.meta.env?.BASE_URL;
  const base = environmentBase ?? configuredBase ?? (repository ? `/${repository}` : '/');
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}` || '/';
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function tagHref(tag: string) {
  return withBase(`/tags/${encodeURIComponent(tag)}/`);
}

export function projectStatusLabel(status: 'active' | 'paused' | 'completed') {
  return {
    active: '进行中',
    paused: '已暂停',
    completed: '已完成',
  }[status];
}
