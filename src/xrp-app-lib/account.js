import * as bb from 'bluebird';
import Errors from './errors';
import * as superagent from 'superagent';
import * as rippleLib from 'ripple-lib'

const http = bb.promisifyAll(superagent);

export default class Account {
  constructor(options) {
    if (options && options.publicKey) {
      this._publicKey = options.publicKey;
    } else {
      throw new Errors.InvalidPublicKey
    }
  }

  get publicKey() {
    return this._publicKey;
  }

  get balance() {
    return this._balance;
  }

  async updateBalance() {
    const response = await http.get(`https://api.ripple.com/v1/accounts/${this.publicKey}/balances`).endAsync()

    if (response.body.success) {
        const balance = response.body.balances.reduce((prev, current) => {
            if (prev) {
                return prev
            }
            else if (current.currency === 'XRP') {
                return current
            }
            else {
                return false
            }
        }, false)

        this._balance = parseFloat(balance.value)
        return parseFloat(balance.value)
    }
    else {
        return this._balance = 0;
    }
  }

}

