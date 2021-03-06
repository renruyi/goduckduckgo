const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');
const qs = require('querystring');

const BASE_URL = 'https://duckduckgo.com';
const BROWSER_HEADERS = {
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
  'Accept': '*/*'
}

class Duck {
  constructor(config) {
    config = config || {};
    this.r = axios.create({
      baseURL: config.baseURL || BASE_URL,
      timeout: config.timeout || 2000,
      headers: config.headers || BROWSER_HEADERS,
      proxy: config.proxy
    });
    this.searchAPI = '/html';
    this.cheerio = cheerio;
    this.maxPage = config.maxPage || 5;
    this.maxResults = 30 + (this.maxPage - 1) * 50;
  }

  search(query, config) {
    config = config || {};
    let maxPage = config.maxPage || this.maxPage;
    let maxResults = 30 + (maxPage - 1) * 50;

    return new Promise((resolve, reject)=>{
      const q = {
        q: query,
        t: 'hd',
        ia: 'web'
      };
      let page = 1;
      let results = [];
      let r = this.r.get(this.searchAPI, {params: q});

      const loop = (p) => {
        p.then(res => {
          const $ = this.cheerio.load(res.data);
          let result = $('a.result__url').map((i, el) => $(el).attr('href')).get();
          results = results.concat(result);
          let pq = _.chain($('form').serializeArray().slice(1))
          .keyBy('name')
          .mapValues('value')
          .value();
          if(typeof pq.s === 'undefined' || pq.s >= maxResults){
            resolve(results);
            return
          }else{
            loop(this.r.post(this.searchAPI, qs.stringify(pq)));
          }
        })
      }

      loop(r);
      
    });
  }
}

module.exports = Duck;