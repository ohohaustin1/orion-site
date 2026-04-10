export function setSEO(opts: { title: string; description: string; url?: string }) {
  document.title = opts.title;

  const setMeta = (attr: string, key: string, value: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  setMeta('name', 'description', opts.description);
  setMeta('property', 'og:title', opts.title);
  setMeta('property', 'og:description', opts.description);
  if (opts.url) setMeta('property', 'og:url', opts.url);
}
