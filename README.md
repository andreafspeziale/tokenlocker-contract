# TokenLocker and TokenTimelock
The project contains:

**SampleToken**: sample StandardBurnableToken ERC20 token to be used as locked token.

**AirdropToken**: sample StandardToken ERC20 token to be used as accidentaly airdropped token.

**TokenTimelock**: OpenZeppelin contract for token lock. (just for test / learning purposes)

**TokenLocker**: my implementation for token lock and multiple release.
The contract provide also a function invokable only by the owner to withdraw eventually ERC20 dropped in.

## System used
- node v9.10.1
- npm 5.8.0

## Install
- `$ npm i`

## Set env
- `$ source set_path.sh`

## Config
The mainet migration will deploy only the TokenLocker contract using as params the config file present in the config folder.<br>
Copy the sample into an actually .js file and fill it with your needs.

- `$ cd config`
- `$ cp config.js.sample config.js`

## Available networks
- development
- parity (usage needs to be granted)
- ropsten (using infura and a metamask account)
- mainet (needs a parity synced local node + ledger)

## Run local node
- `$ npm run ganache`

## Migrate
- `$ npm run migrate:dev`

## Tests
- `$ npm run test:dev`

## Development scripts
Useful javascript scripts for lock simulation based on the locking contract

For OpenZeppelin contract:

- `$ npm run send:timelock`    send 20 ERC20 tokens to TokenTimelock 
- `$ npm run release:timelock` release to the migrated beneficiary the 20 ERC20 tokens
- `$ npm run balance:timelock` get the balances of the actors
  
For TokenLocker contract:

- `npm run send:sample:locker`  send 20 ERC20 tokens to TokeLocker 
- `npm run send:airdrop:locker` send 20 ERC20 tokens to TokeLocker
- `npm run release:locker` let one of the beneficiary claim its tokens
- `npm run withdraw` let the TokenLocker owner withdraw airdropped tokens
- `npm run balance:locker` get the balances of the actors

