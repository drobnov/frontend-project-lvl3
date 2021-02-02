// @ts-check

import axios from 'axios';
import * as yup from 'yup';
import onChange from './view.js';
import parseRss from './parser.js';

const schema = yup.string().url();

const validate = (url) => schema.isValid(url);

const isDuplicateFeeds = (link, feeds) => {
  let result = true;
  feeds.forEach((feed) => {
    if (feed.link === link) {
      result = false;
    }
  });
  return result;
};

const init = () => {
  const state = {
    valid: true,
    error: '',
    url: '',
    feeds: [],
    posts: [],
    success: '',
  };

  const watchedState = onChange(state);

  const inputUrl = document.querySelector('input[name="url"]');
  const form = document.querySelector('form.rss-form');

  inputUrl.addEventListener('input', (e) => {
    e.preventDefault();
    // @ts-ignore
    const { value } = e.target;
    watchedState.url = value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    validate(state.url)
      .then((data) => {
        if (!data) {
          watchedState.error = 'inValidUrl';
          watchedState.valid = data;
        } else {
          watchedState.error = '';
          watchedState.valid = data;
        }
      })
      .then(() => {
        if (state.valid) {
          axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(state.url)}`)
            .then((response) => response.data)
            .then((data) => {
              const content = data.contents;
              const parse = parseRss(content);
              if (parse === null) {
                watchedState.error = 'inValidRss';
              } else if (!isDuplicateFeeds(parse.feeds.link, state.feeds)) {
                watchedState.error = 'rssExists';
              } else {
                watchedState.error = '';
                watchedState.success = 'success';
                watchedState.feeds = [parse.feeds, ...watchedState.feeds];
                watchedState.posts = [...parse.posts, ...watchedState.posts];
              }
            })
            .catch((error) => {
              console.log(error);
              watchedState.error = 'networkError';
            });
        }
      });
  });
};

export default init;