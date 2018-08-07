var Migrations = artifacts.require('./Migrations.sol')
const colors = require('colors')

module.exports = (deployer, network) => {
	console.log(colors.magenta(`[network]: ${network}\n`))
	return deployer.deploy(Migrations)
		.then((instance) => {
			console.log(colors.green(`[migrationInstance address]: ${instance.address}`))
		})
}
