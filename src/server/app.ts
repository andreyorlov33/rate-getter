import express, { Request, Response } from 'express';
import { dataService } from './data-service';
import { postgresConnector } from './postgres-connector';
require('./lib/db'); // using require prevents webpack from tree-shaking it out

const app = express();

app.use('/bundles', express.static(`public/bundles`, { maxAge: 604800e3 }));
app.use(express.static(`public`, { maxAge: 604800e3 }));

app.get('/api/rates', async (req, res) => {
	try {
		const  cDAI = await postgresConnector.getRateData('cDAI')
		const aaveDAI = await postgresConnector.getRateData('aaveDAI')

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
          <title>Andrey's DAI Rate Getter</title>
        </head>
        <body>
          <div id="app">⛓⛓⛓⛓⛓</div>
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
	await postgresConnector.runMigration();
	console.log('App is running');
});
