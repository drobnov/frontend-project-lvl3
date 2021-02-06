// @ts-check
import { uniqueId } from 'lodash';

const parserDom = (rss) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'text/html');
  return doc.querySelector('rss');
};

const parserFeeds = (rss, rssLink) => {
  const title = rss.querySelector('channel > title');
  const description = rss.querySelector('channel > description');
  const link = rss.querySelector('channel > link');
  const result = {
    title: title.childNodes[0].textContent,
    description: description.childNodes[0].textContent,
    link: link.nextSibling.textContent,
    rssLink,
  };
  return result;
};

const parsePosts = (rss, parentsLink, rssLink) => {
  const posts = rss.querySelectorAll('item');
  const result = Array.from(posts).map((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');
    const id = uniqueId();
    return ({
      parentsLink,
      title: title.childNodes[0].textContent,
      description: description.childNodes[0].textContent,
      link: link.nextSibling.textContent,
      id,
      rssLink,
    });
  });
  return result;
};

const parseRss = (element, rssLink) => {
  const elementRss = parserDom(element);
  if (elementRss === null) {
    return null;
  }
  const feeds = parserFeeds(elementRss, rssLink);
  const posts = parsePosts(elementRss, feeds.link, rssLink);
  return { feeds, posts };
};

export default parseRss;
