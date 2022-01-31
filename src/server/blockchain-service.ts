import Web3 from 'web3';

const cDaiAbi = require('./abi/cDaiAbi.json');
const aaveAbi = require('./abi/aaveAbi.json');

class BlockChainRateGetter {
	private providerAddress = 'https://eth.coincircle.com/';
	private web3Provider;
	private web3Client;
	private cDaiAddress = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
	private aaveAddress = '0x778A13D3eeb110A4f7bb6529F99c000119a08E92';

	constructor() {
		this.web3Provider = new Web3.providers.HttpProvider(this.providerAddress);
		this.web3Client = new Web3(this.web3Provider);
	}

	public async getRates() {
		const cDAI = await this.getCompoundDAIRate();
		const aaveDAI = await this.getAaveRate();

		return { cDAI, aaveDAI };
	}

	private async getCompoundDAIRate() {
		const ethMantissa = 1e18;
		const blocksPerDay = 6570;
		const daysPerYear = 365;

		const cToken = new this.web3Client.eth.Contract(cDaiAbi, this.cDaiAddress);

		const borrowRatePerBlock = await cToken.methods.borrowRatePerBlock().call();

		const borrowApy =
			(Math.pow(
				(borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
				daysPerYear
			) -
				1) *
			100;
		return borrowApy.toFixed(5);
	}

	private async getAaveRate() {
		const cToken = new this.web3Client.eth.Contract(aaveAbi, this.aaveAddress);
		const rate = await cToken.methods.getAverageStableRate().call();
		// weird javascript scientific notation thing 😵‍💫
		return Number((rate / (10 ^ 18)).toString().slice(0, 4)).toPrecision(6);
	}
}

export const blockChainRateGetter = new BlockChainRateGetter();
