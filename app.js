(() => {
  'use strict';
  const data = window.RESEARCH_SITE;
  if (!data) return;
  const $ = id => document.getElementById(id);
  const element = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  const date = value => value.length === 4 ? value : new Date(value + (value.length === 7 ? '-01' : '') + 'T12:00:00')
    .toLocaleDateString('en-US', { month: 'short', ...(value.length === 10 ? { day: 'numeric' } : {}), year: 'numeric' });
  function links(items, className = 'link-row') {
    const row = element('div', className);
    for (const item of items || []) {
      try {
        const url = new URL(item.url);
        if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) continue;
        const a = element('a', '', item.label + ' ↗');
        a.href = url.href;
        if (url.protocol !== 'mailto:') { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        row.append(a);
      } catch { /* Ignore incomplete URLs. */ }
    }
    return row;
  }
  document.title = data.name + ' — Wireless Communications & AI';
  $('brand-name').textContent = data.name;
  $('footer-name').textContent = data.name;
  $('hero-name').replaceChildren(document.createTextNode(data.name), element('span', 'name-dot', '.'));
  $('template-banner').hidden = !data.template;
  $('headline').replaceChildren(...data.headline.split('\n').flatMap((line, i) =>
    i ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
  $('intro').textContent = data.intro;
  $('interests').replaceChildren(...data.interests.map(v => element('span', '', v)));
  $('about-heading').textContent = data.aboutHeading;
  $('bio').textContent = data.bio;
  $('profile-links').replaceChildren(...links(data.links).childNodes);
  const dialog = $('update-dialog');
  function openUpdate(update) {
    const title = element('h2', '', update.title);
    title.id = 'dialog-title';
    $('dialog-content').replaceChildren(
      element('div', 'eyebrow', (update.example ? 'EXAMPLE / ' : '') + update.type.toUpperCase() + ' · ' + date(update.date)),
      title, element('p', '', update.body || update.summary), links(update.links));
    dialog.showModal();
  }
  document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close();
  });
  let filter = 'All';
  let showAllUpdates = false;
  const updatePreviewSize = 4;
  function renderUpdates() {
    const query = $('search').value.trim().toLowerCase();
    const updates = [...data.updates].sort((a, b) => b.date.localeCompare(a.date)).filter(v =>
      (filter === 'All' || v.type === filter) && [v.title, v.summary, v.body || ''].join(' ').toLowerCase().includes(query));
    const visible = showAllUpdates ? updates : updates.slice(0, updatePreviewSize);
    $('updates-list').replaceChildren(...visible.map(update => {
      const row = element('article', 'update-row');
      const time = element('time', 'update-date', date(update.date));
      time.dateTime = update.date;
      const copy = element('div');
      copy.append(element('span', 'tag', update.type));
      if (update.example) copy.append(element('span', 'example-label', 'Illustrative entry'));
      const title = element('h3');
      const titleButton = element('button', 'update-title', update.title);
      titleButton.addEventListener('click', () => openUpdate(update));
      title.append(titleButton);
      copy.append(title, element('p', '', update.summary));
      const button = element('button', 'read-update', '↗');
      button.setAttribute('aria-label', 'Read ' + update.title);
      button.addEventListener('click', () => openUpdate(update));
      row.append(time, copy, button);
      return row;
    }));
    if (!updates.length) $('updates-list').append(element('p', 'empty-state', data.updates.length ?
      'No updates match your search. Try another term or category.' : 'Research updates will appear here.'));
    $('results-count').textContent = visible.length < updates.length ?
      'Showing ' + visible.length + ' of ' + updates.length + ' updates' :
      updates.length + (updates.length === 1 ? ' update' : ' updates');
    $('more-updates').hidden = visible.length >= updates.length;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    showAllUpdates = false;
    document.querySelectorAll('[data-filter]').forEach(v => {
      v.classList.toggle('active', v === button);
      v.setAttribute('aria-pressed', String(v === button));
    });
    renderUpdates();
  }));
  $('search').addEventListener('input', () => { showAllUpdates = false; renderUpdates(); });
  $('more-updates').addEventListener('click', () => {
    showAllUpdates = true;
    renderUpdates();
    const firstNewTitle = $('updates-list').children[updatePreviewSize]?.querySelector('.update-title');
    if (firstNewTitle) firstNewTitle.focus({ preventScroll: true });
  });
  renderUpdates();

  const sortedPublications = [...data.publications].sort((a, b) => (b.year || 0) - (a.year || 0));
  const publicationYears = [...new Set(sortedPublications.map(pub => pub.year).filter(Boolean))];
  $('archive-size').textContent = String(data.publications.length);
  for (const year of publicationYears) {
    const option = element('option', '', String(year));
    option.value = String(year);
    $('publication-year').append(option);
  }
  if (data.publications.some(pub => !pub.year)) {
    const option = element('option', '', 'Year not listed');
    option.value = 'Undated';
    $('publication-year').append(option);
  }
  const pageSize = 6;
  let publicationPage = 1;
  function renderPublications() {
    const year = $('publication-year').value;
    const query = $('publication-search').value.trim().toLowerCase();
    const publications = sortedPublications.filter(pub =>
      (year === 'All' || (year === 'Undated' ? !pub.year : String(pub.year) === year)) &&
      [pub.title, pub.authors, pub.venue].join(' ').toLowerCase().includes(query));
    const pageCount = Math.max(1, Math.ceil(publications.length / pageSize));
    publicationPage = Math.min(publicationPage, pageCount);
    const start = (publicationPage - 1) * pageSize;
    const visible = publications.slice(start, start + pageSize);
    $('publications-list').replaceChildren(...visible.map((pub, i) => {
      const row = element('article', 'publication');
      const copy = element('div');
      copy.append(element('h3', '', pub.title), element('p', '', pub.authors),
        element('p', 'venue', pub.venue || 'Year and venue not listed on Google Scholar'));
      if (pub.description) copy.append(element('p', '', pub.description));
      copy.append(links(pub.links));
      row.append(element('span', 'pub-index', String(start + i + 1).padStart(2, '0')), copy);
      return row;
    }));
    $('publication-count').textContent = publications.length ?
      'Showing ' + (start + 1) + '–' + (start + visible.length) + ' of ' + publications.length + ' records' :
      'No matching records';
    $('page-status').textContent = publications.length ? 'Page ' + publicationPage + ' of ' + pageCount : '0 pages';
    $('previous-page').disabled = publicationPage <= 1;
    $('next-page').disabled = publicationPage >= pageCount;
    if (!publications.length) $('publications-list').append(element('p', 'empty-state',
      'No publications match your search. Try another year or search term.'));
  }
  const resetPublications = () => { publicationPage = 1; renderPublications(); };
  $('publication-year').addEventListener('change', resetPublications);
  $('publication-search').addEventListener('input', resetPublications);
  for (const [id, direction] of [['previous-page', -1], ['next-page', 1]]) {
    $(id).addEventListener('click', () => {
      publicationPage += direction;
      renderPublications();
      $('publication-count').setAttribute('tabindex', '-1');
      $('publication-count').focus({ preventScroll: true });
      $('publication-count').scrollIntoView({ block: 'start' });
    });
  }
  renderPublications();
  $('projects-list').replaceChildren(...data.projects.map((project, i) => {
    const card = element('article', 'project');
    card.append(element('div', 'project-number', String(i + 1).padStart(2, '0')),
      element('span', 'project-status', project.status), element('h3', '', project.title),
      element('p', '', project.description), links(project.links));
    return card;
  }));
  if (!data.projects.length) $('projects-list').append(element('p', 'empty-state', 'Projects will appear here.'));
  $('education-list').replaceChildren(...(data.education || []).map(item => {
    const entry = element('div', 'education-entry');
    entry.append(element('p', '', item.title), element('span', '', item.detail));
    return entry;
  }));
  $('service-list').replaceChildren(...(data.service || []).map(item => element('li', '', item)));
  $('recognition-list').replaceChildren(...(data.recognition || []).map(item => element('li', '', item)));
  const markNavigation = () => document.querySelectorAll('.header nav a').forEach(a => {
    if (a.hash === location.hash) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
  window.addEventListener('hashchange', markNavigation);
  markNavigation();
})();

