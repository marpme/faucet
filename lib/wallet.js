import { AergoClient } from '@herajs/client';

class Wallet {
    constructor(options) {
        this.address = options.address;
        this.password = options.password;
        this.client = new AergoClient();
        if (!this.address) {
            console.error('Please add configuration for local account address and password.');
        }
    }
    send(recipient, amount) {
        console.log('Sending', amount, 'to', recipient);
        this.client.accounts.unlock(this.address, this.password).then(() => {
            this.client.accounts.sendTransaction({
                from: this.address,
                to: recipient,
                amount: `${amount} aer`
            }).then(txhash => {
                this.client.accounts.lock(this.address, this.password);
                console.log('Sent tx', txhash);
            });
        })
    }
    getBalance() {
        return new Promise((resolve, reject) => {
            this.client.getState(this.address).then(state => {
                resolve(state.balance);
            }).catch(e => {
                reject(e);
            });
        });
    }
}

export default Wallet;