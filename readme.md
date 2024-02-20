# GoDuckDuckGo

## Install

```
npm install goduckduckgo --save
```

## Usage

```typescript
import { Duck } from "goduckduckgo";
const d = new Duck();

const results = await d.search("duckduckgo");
```

## Options

```typescript
import { ProxyConfiguration } from 'crawlee'
const config = {
  proxyConfiguration: new ProxyConfiguration({
    proxyUrls: ["http://user:pass@proxy-1.com", "http://user:pass@proxy-2.com"],
  }),
  maxPage: 3,
};

const d = new Duck(config);
```
