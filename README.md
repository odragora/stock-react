# Stock React
### test assignment

D3 chart for financial data in React app

## Instructions
```npm install```

```npm start```

This will set everything up, run the application and open a new tab in your browser with the app on localhost.

## API key note
The application makes API calls to the Alphavantage server.
App is configured with a demo key.
There is a possibility you will hit the requests limit.

In this case, you can get a free key here:
https://www.alphavantage.co/support/#api-key

When you'll have a key, you can replace a demo key with a new one here:

```
src/chart/Chart.js, line 10
```
```javascript
const apiKey = 'demo';
```
