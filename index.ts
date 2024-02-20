import { CheerioCrawler, Dataset, RequestQueue } from "crawlee";

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export class Duck {
  private crawler: CheerioCrawler;
  private data: SearchResult[] = [];

  constructor(options: { maxPage?: number; proxyConfiguration?: any } = {}) {
    const { proxyConfiguration } = options;
    const data = this.data;
    const maxPage = options.maxPage || 1;
    let page = 0;
    this.crawler = new CheerioCrawler({
      proxyConfiguration,
      async requestHandler({ request, response, body, contentType, $ }) {
        page++;
        // Do some data extraction from the page with Cheerio.
        $(".results > .result > div").each((index, el) => {
          const title = $(el).find("h2 > a").text();
          const snippet = $(el).find(".result__snippet").text();
          const url = $(el).find("h2 > a").attr("href") as string;
          data.push({ title, snippet, url });
        });
        if (page < maxPage) {
          const url = new URL(request.url);
          const length = data.length;
          url.searchParams.set("s", length.toString());

          const queue = await RequestQueue.open();
          console.log('adding request', url.toString())
          queue.addRequest({ url: url.toString() });
        }
      },
    });
  }

  async search(q: string) {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    await this.crawler.run([url]);
    const res = [...this.data];
    this.data = [];
    return res;
  }
}
