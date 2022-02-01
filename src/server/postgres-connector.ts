import { Client } from 'pg';

class PostgresConnector {
	private client;
	private port = 5432;
	private username = 'pguser';
	private password = 'password';
	private database = 'app';
	private pghost = 'rate-getter_postgres_1';

	async cachedClient() {
		if (!this.client) {
			this.client = new Client({
				host: this.pghost,
				user: this.username,
				password: this.password,
				database: this.database,
				port: this.port,
			});

			await this.client.connect();
		}
		return this.client;
	}

	async runMigration(){
		const c = await this.cachedClient()

		const query = {
			text: `
				CREATE TABLE IF NOT EXISTS  historical_rates (
				token_name TEXT,
				borrow_supply_rate DECIMAL,
				created_at TIMESTAMP DEFAULT NOW()
			);`
		}

		await c.query(query)

	}

	async saveHistoricalRate(tokenName, borrowRate) {
		const c = await this.cachedClient();
		const query = {
			text: `INSERT INTO historical_rates (token_name, borrow_supply_rate) VALUES ($1, $2)`,
			values: [tokenName, borrowRate],
		};

		c.query(query)
			.then((res) => console.log(res.rows[0]))
			.catch((e) => console.log(`ERROR INSERTING into historical_rates`, e));
	}

	async getRateData(tokenName) {
		const c = await this.cachedClient();
		const query = {
			text: `SELECT * FROM historical_rates WHERE token_name = $1 ORDER BY created_at DESC LIMIT 60`,
			values: [tokenName],
		};

		const res = await c.query(query);
		return res.rows;
	}
}

export const postgresConnector = new PostgresConnector();
