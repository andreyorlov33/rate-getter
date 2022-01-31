import express, { Request, Response } from 'express';
import { dataService } from './data-service';
import { redisConnector } from './redis-connector';
require('./lib/db'); // using require prevents webpack from tree-shaking it out

const app = express();

app.use('/bundles', express.static(`public/bundles`, { maxAge: 604800e3 }));
app.use(express.static(`public`, { maxAge: 604800e3 }));

app.get('/api/rates', async (req, res) => {
	try {
		 const cDAI = await redisConnector.getTokenRateHistory('cDAI')
		 const aaveDAI = await redisConnector.getTokenRateHistory('aaveDAI')
		 
		res.send({cDAI, aaveDAI})
	} catch (err) {
		console.log(err);
	}
});

app.get('*', async (req: Request, res: Response) => {
	try {
		// Disable caching of index file
		res.setHeader('Surrogate-Control', 'no-store');
		res.setHeader(
			'Cache-Control',
			'no-store, no-cache, must-revalidate, proxy-revalidate'
		);
		res.setHeader('Pragma', 'no-cache');
		res.setHeader('Expires', '0');
		const html = `
      <html>
        <head>
          <title>App</title>
        </head>
        <body>
          <div id="app">FOOOO</div>
          <script src="/bundles/main.bundle.js"></script>
        </body>
      </html>
    `;
		res.send(html);
	} catch (err) {
		console.error(err);
	}
});

dataService.startFetchingLoop();

app.listen(3000, '0.0.0.0', async () => {
	console.log('App is running');
});
