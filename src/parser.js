// @ts-check
import { uniqueId } from 'lodash';

const parserDom = (rss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'text/html');
  return doc.querySelector('rss');
};

const parserFeeds = (rss) => {
  const title = rss.querySelector('channel > title');
  const description = rss.querySelector('channel > description');
  const link = rss.querySelector('channel > link');
  const result = {
    title: title.textContent,
    description: description.textContent,
    link: link.nextSibling.textContent,
  };
  return result;
};

const parsePosts = (rss, parentsLink) => {
  const posts = rss.querySelectorAll('item');
  const result = Array.from(posts).map((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');
    const id = uniqueId();
    return ({
      parentsLink,
      title: title.textContent,
      description: description.textContent,
      link: link.nextSibling.textContent,
      id,
    });
  });
  return result;
};

const parseRss = (element) => {
  const elementRss = parserDom(element);
  if (elementRss === null) {
    return null;
  }
  const feeds = parserFeeds(elementRss);
  const posts = parsePosts(elementRss, feeds.link);
  return { feeds, posts };
};

export default parseRss;
