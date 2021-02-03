// @ts-check

import onChange from 'on-change';
import i18n from 'i18next';
import text from './text.js';

const runApp = () => {
  i18n.init({
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          ...text,
        },
      },
    },
  });
};
const initPromise = Promise.resolve();
initPromise.then(() => runApp());

const input = document.querySelector('input[name="url"]');
const divFeedback = document.querySelector('div.feedback');

const renderingErrors = (error) => {
  if (error === 'inValidUrl') {
    input.classList.add('is-invalid');
    divFeedback.textContent = i18n.t(`errors.${error}`);
    divFeedback.classList.add('text-danger');
  } else if (error === '') {
    input.classList.remove('is-invalid');
    divFeedback.textContent = '';
    divFeedback.classList.remove('text-danger');
  } else {
    divFeedback.textContent = i18n.t(`errors.${error}`);
    divFeedback.classList.add('text-danger');
  }
};

const renderingSuccess = () => {
  divFeedback.textContent = i18n.t('success');
  divFeedback.classList.add('text-success');
};

const createsH2 = (content) => {
  const h2 = document.createElement('h2');
  h2.textContent = content;
  return h2;
};

const createsHtmlEl = (htmlElement, attributesValues = {}) => {
  const element = document.createElement(htmlElement);
  const attributes = Object.keys(attributesValues);
  attributes.forEach((attribut) => element.setAttribute(attribut, attributesValues[attribut]));
  return element;
};

const renderingFeeds = (feeds) => {
  const feedsDiv = document.querySelector('.feeds');
  feedsDiv.innerHTML = '';
  const h2 = createsH2(i18n.t('h2.feeds'));
  const ul = createsHtmlEl('ul', { class: 'list-group mb-5' });
  const fedsList = feeds.map((feed) => {
    const { title, description } = feed;
    const li = createsHtmlEl('li', { class: 'list-group-item' });
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    p.textContent = description;
    li.append(h3);
    li.append(p);
    return li;
  });
  fedsList.forEach((li) => ul.append(li));
  feedsDiv.append(h2);
  feedsDiv.append(ul);
};

const renderingPosts = (posts) => {
  const postsDiv = document.querySelector('.posts');
  postsDiv.innerHTML = '';
  const h2 = createsH2(i18n.t('h2.posts'));
  const ul = createsHtmlEl('ul', { class: 'list-group' });
  const postsList = posts.map((post) => {
    const {
      title, link, id,
    } = post;
    const li = createsHtmlEl('li', { class: 'list-group-item d-flex justify-content-between align-items-start' });
    const a = createsHtmlEl('a', {
      href: link, class: 'font-weight-bold', 'data-id': id, target: '_blank', rel: 'noopener noreferrer',
    });
    a.textContent = title;
    const button = createsHtmlEl('button', {
      type: 'button', class: 'btn btn-primary btn-sm', 'data-id': id, 'data-toggle': 'modal', 'data-target': '#modal',
    });
    button.textContent = i18n.t('button.preview');
    li.append(a);
    li.append(button);
    return li;
  });
  postsList.forEach((li) => ul.append(li));
  postsDiv.append(h2);
  postsDiv.append(ul);
};

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'valid') {
      if (!value) {
        renderingErrors(watchedState.error);
      } else {
        renderingErrors('');
      }
    } if (path === 'error' && value !== 'inValidUrl') {
      renderingErrors(value);
    } if (path === 'success' && value === 'success') {
      renderingSuccess();
    } if (path === 'feeds') {
      const form = document.querySelector('form');
      form.reset();
      renderingFeeds(watchedState.feeds);
    } if (path === 'posts') {
      renderingPosts(watchedState.posts);
    }
  });
  return watchedState;
};
