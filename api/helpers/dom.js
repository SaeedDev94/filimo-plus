const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const DomHelper = {
  friendlyName: 'Dom',
  description: 'Extract data from dom',
  inputs: {
    html: {
      type: 'string',
      description: 'Html content',
      required: true
    },
    content: {
      type: 'string',
      description: 'Content type (ex: General: items, Specific: home, tagNext, movie)',
      required: true
    }
  },
  exits: {
    success: {
      description: 'Data is ready',
    }
  },
  listHead: (section) => {
    const titleElement = section.querySelector('.list-title .title');
    const linkElement = titleElement ? titleElement.querySelector('a') : null;
    const title = titleElement ? titleElement.textContent.trim() : '';
    const link = linkElement ? linkElement.getAttribute('href') : '';
    return {
      title,
      tag: link.split('/').pop()
    };
  },
  listBody: (nodes) => {
    const data = [];
    nodes.forEach((item) => {
      const imageElement = item.querySelector('img.ds-media_image');
      if (!imageElement) {
        return;
      }
      const title = imageElement.getAttribute('alt');
      const descriptionElement = item.querySelector('.ds-thumb_content_bottom');
      descriptionElement.removeChild(descriptionElement.querySelector('.ds-badges'));
      data.push({
        id: item.getAttribute('data-uid'),
        image: imageElement.getAttribute('src'),
        title,
        description: descriptionElement.textContent
          .trim()
          .split('\n')
          .map(item => item.trim())
          .filter(item => !!item.trim())
          .join(' ')
          .replace(title, '')
          .trim()
      });
    });
    return data;
  },
  items: (document) => {
    const items = [];
    document.querySelectorAll('section.list-item.list-thumbnail').forEach((section) => {
      const head = DomHelper.listHead(section);
      items.push({
        title: head.title,
        tag: head.tag,
        list: DomHelper.listBody(section.querySelectorAll('.list-content .item'))
      });
    });
    return items;
  },
  homeSpecial: (document) => {
    let data = null;
    document.querySelectorAll('section.list-item.list-thumbplay').forEach((section, index) => {
      if (index !== 0) {
        return;
      }
      const head = DomHelper.listHead(section);
      data = {
        title: head.title,
        tag: head.tag,
        list: DomHelper.listBody(section.querySelectorAll('.list-content .item'))
      };
    });
    return data;
  },
  movie: (document) => {
    const data = {};
    //
    const playLinkElement = document.querySelector('.movie-actions .left-side a#moreinfo_login');
    data.id = playLinkElement ? playLinkElement.getAttribute('href').split('/').pop() : '';
    //
    const titleElement = document.querySelector('.movie-single .movie-title .fa');
    data.title = titleElement ? titleElement.textContent.trim() : '';
    //
    data.descriptions = [];
    document.querySelectorAll('.section-gallery .gallery_each-movie').forEach((container) => {
      const descriptionTitleElement = container.querySelector('.gallery_each-movie_title');
      const descriptionTextElement = container.querySelector('p');
      if (descriptionTitleElement && descriptionTextElement) {
        data.descriptions.push({
          title: descriptionTitleElement.textContent.trim(),
          text: descriptionTextElement.textContent.trim()
        });
      }
    });
    //
    const coverElement = document.querySelector('.movie-single .single-intro');
    data.cover = coverElement ? coverElement.style.backgroundImage.slice(4, -1).replace(/['"]/g, '') : '';
    //
    const imageElement = document.querySelector('.movie-single .movie-poster img');
    data.image = imageElement ? imageElement.getAttribute('src') : '';
    //
    data.director = '';
    const directorElement = document.querySelector('.movie-single .movie-director');
    if (directorElement) {
      data.director = directorElement.textContent
        .trim()
        .split('\n')
        .map(item => item.trim())
        .filter(item => !!item.trim())
        .join(' ');
    }
    //
    data.series = [];
    document.querySelectorAll('.section-episodes .accordion-item').forEach((container) => {
      const episodeTitleElement = container.querySelector('.right .title');
      const episodeLinkElement = container.querySelector('.left a');
      if (episodeTitleElement && episodeLinkElement) {
        data.series.push({
          id: episodeLinkElement.getAttribute('href').split('/').pop(),
          title: episodeTitleElement.textContent.trim()
        });
      }
    });
    //
    data.suggestions = {
      title: 'پیشنهادهای ویژه',
      tag: '',
      list: DomHelper.listBody(document.querySelectorAll('.section-related .item.swiper-slide'))
    };
    //
    return data;
  },
  tagNext: (document) => {
    const items = [];
    items.push({
      list: DomHelper.listBody(document.querySelectorAll('.item'))
    });
    return items;
  },
  getNext: (document) => {
    let next = '';
    const nextElement = document.querySelector('#pageLoadMore');
    if (nextElement) {
      next = nextElement.getAttribute('data-href') || '';
    }
    return next;
  },
  fn: async (inputs, exits) => {
    const data = {};
    const dom = new JSDOM(inputs.html);
    const document = dom.window.document;
    switch (inputs.content) {
      case 'items':
        data.items = DomHelper.items(document);
        data.next = DomHelper.getNext(document);
        break;
      case 'home':
        data.special = DomHelper.homeSpecial(document);
        data.items = DomHelper.items(document);
        data.next = DomHelper.getNext(document);
        break;
      case 'tagNext':
        data.items = DomHelper.tagNext(document);
        data.next = DomHelper.getNext(document);
        break;
      case 'movie':
        data.movie = DomHelper.movie(document);
        break;
    }
    return exits.success(data);
  }
};

module.exports = DomHelper;
