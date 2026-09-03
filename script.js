const ids = ['about', 'work', 'thinking', 'contact'];
let active = 'about';
let pointerStart = null;
let lastPointerActivation = 0;
const cards = [...document.querySelectorAll('[data-card]')];
const navs = [...document.querySelectorAll('[data-select]')];
const dots = [...document.querySelectorAll('[data-dot]')];
const dialogs = [...document.querySelectorAll('[data-detail]')];

function select(id) {
  active = id;
  const selectedIndex = ids.indexOf(id);
  cards.forEach((card, index) => {
    card.classList.remove('active', 'p1', 'p2', 'p3');
    const position = (index - selectedIndex + ids.length) % ids.length;
    card.classList.add(position === 0 ? 'active' : `p${position}`);
  });
  navs.forEach(item => item.classList.toggle('active', item.dataset.select === id));
  dots.forEach(item => item.classList.toggle('active', item.dataset.dot === id));
}

function open(id) {
  const detail = document.querySelector(`[data-detail="${id}"]`);
  if (detail && !detail.open) detail.showModal();
}

function activateCard(card) {
  const id = card.dataset.card;
  if (id === active) open(id);
  else select(id);
}

cards.forEach(card => {
  card.addEventListener('pointerdown', event => {
    pointerStart = { id: card.dataset.card, x: event.clientX, y: event.clientY };
  });
  card.addEventListener('pointerup', event => {
    if (!pointerStart || pointerStart.id !== card.dataset.card) return;
    const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    pointerStart = null;
    if (moved > 12) return;
    event.preventDefault();
    lastPointerActivation = Date.now();
    activateCard(card);
  });
  card.addEventListener('pointercancel', () => { pointerStart = null; });
  card.addEventListener('click', event => {
    event.preventDefault();
    if (Date.now() - lastPointerActivation > 500) activateCard(card);
  });
});

navs.forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.select;
    if (item.closest('dialog')) {
      dialogs.forEach(dialog => dialog.open && dialog.close());
      open(id);
    } else select(id);
  });
});
dots.forEach(item => item.addEventListener('click', () => select(item.dataset.dot)));
document.querySelectorAll('[data-close]').forEach(item => item.addEventListener('click', () => item.closest('dialog').close()));
dialogs.forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); }));
document.addEventListener('keydown', event => {
  if (dialogs.some(dialog => dialog.open)) return;
  if (event.key === 'ArrowLeft') select(ids[(ids.indexOf(active) + ids.length - 1) % ids.length]);
  if (event.key === 'ArrowRight') select(ids[(ids.indexOf(active) + 1) % ids.length]);
  if (event.key === 'Enter') open(active);
});

select(active);
