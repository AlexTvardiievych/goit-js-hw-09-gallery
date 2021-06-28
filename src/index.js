import './sass/main.scss';
import images from './js/gallery-items.js';

const refs = {
  gallery: document.querySelector('.js-gallery'),
  lightbox: document.querySelector('.js-lightbox'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxImage: document.querySelector('.lightbox__image'),
  closeButton: document.querySelector('.lightbox__button'),
};

const imgMarkup = createImages(images);
refs.gallery.insertAdjacentHTML('beforeend', imgMarkup);
refs.gallery.addEventListener('click', onOpenModal);
refs.closeButton.addEventListener('click', onCloseModal);
refs.lightboxOverlay.addEventListener('click', onCloseModal);

function createImages(images) {
  return images
    .map(({ preview, original, description }, index) => {
      return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      data-alt="${description}"
      data-index = ${index}
    />
  </a>
</li>`;
    })
    .join('');
}

function onOpenModal(event) {
  event.preventDefault();
  const currentImg = event.target;

  if (event.target.nodeName !== 'IMG') {
    return;
  }
  window.addEventListener('keydown', onKeystrokess);
  refs.lightbox.classList.add('is-open');
  refs.lightboxImage.src = currentImg.dataset.source;
  refs.lightboxImage.alt = currentImg.dataset.alt;
  refs.lightboxImage.setAttribute('data-index', currentImg.dataset.index);
}

function onCloseModal(event) {
  if (event.currentTarget === event.target) {
    refs.lightbox.classList.remove('is-open');
    refs.lightboxImage.removeAttribute('data-index');
    refs.lightboxImage.removeAttribute('src');
    refs.lightboxImage.removeAttribute('alt');
    window.removeEventListener('keydown', onKeystrokess);
  }
}

function onKeystrokess(event) {
  const esc = event.code === 'Escape';
  const arrowRight = event.code === 'ArrowRight';
  const arrowLeft = event.code === 'ArrowLeft';
  if (esc) {
    onCloseModal(esc);
  }

  if (arrowRight || arrowLeft) {
    onNextImg(arrowRight);
  }
}

function onNextImg(right) {
  let index;

  index = right
    ? Number(refs.lightboxImage.dataset.index) + 1
    : Number(refs.lightboxImage.dataset.index) - 1;

  if (index < 0) {
    index = images.length + index;
  }

  if (index === images.length) {
    index = 0;
  }

  refs.lightboxImage.src = images[index].original;
  refs.lightboxImage.dataset.index = index;
}
