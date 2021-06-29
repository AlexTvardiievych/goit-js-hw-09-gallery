import images from './gallery-items.js';

const refs = {
    gallery: document.querySelector('.js-gallery'),
    lightbox: document.querySelector('.js-lightbox'),
    lightboxOverlay: document.querySelector('.lightbox__overlay'),
    lightboxImage: document.querySelector('.lightbox__image'),
    lightboxCloseButton: document.querySelector('.lightbox__button'),
};

const imgMarkup = createImages(images);

refs.gallery.insertAdjacentHTML('beforeend', imgMarkup);

refs.gallery.addEventListener('click', (event) => {
    openModalWindow(event)
});

function createImages(images) {
    return images
        .map(({ preview, original, alt }, index) => {
            return `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      data-alt="${alt}"
      data-index = ${index}
    />
  </a>
</li>`;
        })
        .join('');
}

function openModalWindow(event) {
    event.preventDefault();

    const currentImg = event.target;

    if (currentImg.nodeName !== 'IMG') {
        return;
    }

    refs.lightbox.classList.add('is-open');
    refs.lightboxImage.src = currentImg.dataset.source;
    refs.lightboxImage.alt = currentImg.dataset.alt;
    refs.lightboxImage.setAttribute('data-index', currentImg.dataset.index);

    refs.lightboxCloseButton.addEventListener('click', closeModalWindow);
    refs.lightboxOverlay.addEventListener('click', closeModalWindow);
    document.addEventListener('keydown', keystroke);
}

const keystroke = function (event) {
    const escButton = event.code === 'Escape';
    const nextImage = event.code === 'ArrowRight';
    const prevImage = event.code === 'ArrowLeft';

    if (escButton) {
        closeModalWindow(event, escButton);
    }
    else {
        if (nextImage || prevImage) {
            onNextImg(nextImage);
        }
    }
}

function onNextImg(nextImage) {
    let imageIndex = nextImage
        ? Number(refs.lightboxImage.dataset.index) + 1
        : Number(refs.lightboxImage.dataset.index) - 1;

    if (imageIndex < 0) {
        imageIndex = images.length + imageIndex;
    }
    else {
        if (imageIndex === images.length) {
            imageIndex = 0;
        }
    }

    refs.lightboxImage.src = images[imageIndex].original;
    refs.lightboxImage.dataset.index = imageIndex;
}

const closeModalWindow = function (event, isEscButton = false) {
    if (event.currentTarget === event.target || isEscButton) {
        refs.lightbox.classList.remove('is-open');
        refs.lightboxImage.removeAttribute('data-index');
        refs.lightboxImage.removeAttribute('src');
        refs.lightboxImage.removeAttribute('alt');
        document.removeEventListener('keydown', keystroke);
        refs.lightboxCloseButton.removeEventListener('click', closeModalWindow);
        refs.lightboxOverlay.removeEventListener('click', closeModalWindow);
    }
}