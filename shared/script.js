/* shared/script.js — 游戏详情页共享 lightbox 逻辑 */

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');

document.querySelectorAll('.media-shot').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    const image = button.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('is-open');
  });
});

lightbox?.addEventListener('click', () => {
  lightbox.classList.remove('is-open');
  if (lightboxImage) lightboxImage.removeAttribute('src');
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') lightbox?.classList.remove('is-open');
});