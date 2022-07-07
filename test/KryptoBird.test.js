const {assert} = require('chai');
// const { Item } = require('react-bootstrap/lib/Breadcrumb');
const _deploy_contracts = require('../migrations/2_deploy_contracts');

const KryptoBird = artifacts.require('./KryptoBird');

// check for chai
require('chai').use(require('chai-as-promised')).should();

contract('KryptoBird', (accounts) => {
    let contract;

    // before tells our tests to run this first before anything else.
    before(async() => {
        contract = await KryptoBird.deployed();
    });

    // testing container - describe
    describe('deployment', async() => {
        // test samples with writing it.
        it('deploys successfuly', async() => {
            const address = await contract.address;

            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, 0x0);
        });

        it('name set correctly', async() => {
            const name = await contract.name();
            assert.equal(name, 'KryptoBird');
        });

        it('symbol set correctly', async() => {
            const symbol = await contract.symbol();
            assert.equal(symbol, 'KBIRDZ');
        });
    });

    describe('minted', async() => {
        it('create new token', async() => {
            const result = await contract.mint('https...1');
            const totalSupply = await contract.totalSupply();

            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;
            assert.equal(event._from, '0x0000000000000000000000000000000000000000', 'from the contract.');
            assert.equal(event._to, accounts[0], 'to is msg.sender.');

            // Failure
            await contract.mint('https...1').should.be.rejected;
        });
    });

    describe('minted multiple', async () => {
        it('create and list multiple tokens', async() => {

            let results = [];
            let kryptoBird;

            await contract.mint('https...2');
            await contract.mint('https...3');
            await contract.mint('https...4');

            const totalSupply = await contract.totalSupply();

            for(i = 0; i < totalSupply; i++){
                kryptoBird = await contract.kryptoBirdz[i];
                results.push(kryptoBird);
            }

            let expected = ['https...1', 'https...2', 'https...3', 'https...4'];
            assert.equal(results.join(','), expected.join(','));

        });
    });
});