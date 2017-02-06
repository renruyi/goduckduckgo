# GoDuckDuckGo
## Usage

```javascript
const Duck = require('goduckduckgo');
const d = new Duck();

d.search('duckduckgo')
.then(console.log)  // logs results from first 5 pages
```

## Options
```javascript
const config = {
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: : {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },
  headers: {
    'User-Agent': 'scraper'
  },
  timeout: 1000
}

const d = new Duck(config);
```