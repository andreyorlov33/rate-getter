import cron from 'node-cron';
import { blockChainRateGetter } from './blockchain-service';
import { postgresConnector } from './postgres-connector';
class DataService {
	public async startFetchingLoop() {
		await this.fetchRates();
		console.log('starting fetching loop');
		const task = cron.schedule('*/30 * * * * *', async () => {
			await this.fetchRates();
		});

		task.start();
	}

	private async fetchRates() {
		const { cDAI, aaveDAI } = await blockChainRateGetter.getRates();
		await postgresConnector.saveHistoricalRate('cDAI', cDAI);
		await postgresConnector.saveHistoricalRate('aaveDAI', aaveDAI);
		console.log(`rates updated, next loop in 30 seconds`);
	}
}

export const dataService = new DataService();
