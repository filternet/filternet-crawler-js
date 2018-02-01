# filternet-crawler-js [WIP]
Check multiple domains simultaneously to find which one is blocked in Iran

### 1. Run the mock server

```bash
node server.js
```

### 2. Run the crawler

```bash
DNS_HOST=<mock-server-ip> HTTP_HOST=<mock-server-ip> TLS_HOST=<mock-server-ip> \
node crawler.js sample.csv [concurrency=10] [output=out.csv]
```

### 3. Sort Output 

```bash

```

## How can I find a list of domains/websites?

#### Cisco Umbrella:

http://s3-us-west-1.amazonaws.com/umbrella-static/index.html

#### Alexa:

http://s3.amazonaws.com/alexa-static/top-1m.csv.zip


#### Majestic:

https://blog.majestic.com/development/majestic-million-csv-daily/
