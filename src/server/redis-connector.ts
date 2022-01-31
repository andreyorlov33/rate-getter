import { createClient } from 'redis';

class RedisConnector {
	private client;

	private async cachedClient() {
		if (!this.client) {
			try {
				this.client = await createClient({ url: 'redis://redis:6379' });
				await this.client.connect();
			} catch (err) {
				console.log('REDIS CONNECT ERROR', err);
			}
		}
		return this.client;
	}

	public async setTokenRateHistory(tokenName, value) {
		const client = await this.cachedClient();

		const tokenHistory = await client.get(tokenName);

		if (!tokenHistory) {
			await client.set(tokenName, JSON.stringify([value]));
			return;
		}

		const parsedHistory = JSON.parse(tokenHistory);
		// store only 30 minutes worth of data 
		if (parsedHistory.length >= 60) {
			parsedHistory.shift();
			parsedHistory.push(value);
			await client.set(tokenName, JSON.stringify(parsedHistory));
			return;
		}

		const updatedValue = [...parsedHistory, value];
		await client.set(tokenName, JSON.stringify(updatedValue));
	}

	public async getTokenRateHistory(tokenName) {
		const client = await this.cachedClient();
		const history = await client.get(tokenName);
		if (!history) {
			console.log(`${tokenName} history is empty`);
			return [];
		}
		return history;
	}
}

export const redisConnector = new RedisConnector();
