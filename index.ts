import { Configuration, RequestQueue } from "@crawlee/core";
import { CheerioCrawler } from "@crawlee/cheerio";

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export class Duck {
  private data: SearchResult[] = [];
  private options: {
    maxPage?: number;
    proxyConfiguration?: any;
    crawleeOptions?: any;
  };

  constructor(
    options: {
      maxPage?: number;
      proxyConfiguration?: any;
      crawleeOptions?: any;
    } = {}
  ) {
    this.options = options;    
  }

  crawlerFactory() {
    const { crawleeOptions, proxyConfiguration } = this.options;
    const config = new Configuration({
      persistStorage: false,
      ...crawleeOptions,
    });
    const data = this.data;
    const maxPage = this.options.maxPage || 1;
    let page = 0;
    return new CheerioCrawler(
      {
        proxyConfiguration,
        async requestHandler({ request, response, body, contentType, $ }) {
          page++;
          // Do some data extraction from the page with Cheerio.
          $(".results > .result > div").each((index, el) => {
            const title = $(el).find("h2 > a").text();
            const snippet = $(el).find(".result__snippet").text();
            const redirectUrl = $(el).find("h2 > a").attr("href") as string;
            let url;
            try {
              const u = new URL("https:" + redirectUrl);
              url = u.searchParams.get("uddg") || redirectUrl;
            } catch (e) {
              url = redirectUrl;
            }

            data.push({ title, snippet, url });
          });
          if (page < maxPage) {
            const url = new URL(request.url);
            const length = data.length;
            url.searchParams.set("s", length.toString());

            const queue = await RequestQueue.open();
            // console.log('adding request', url.toString())
            queue.addRequest({ url: url.toString() });
          }
        },
      },
      config
    );
  }

  async search(q: string) {
    const crawler = this.crawlerFactory();
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    await crawler.run([url]);
    const res = [...this.data];
    this.data = [];
    return res;
  }
}
