import Errors from './errors';
import Account from './account';
import * as rippleLib from 'ripple-lib';
import RippleKeypairs from 'ripple-keypairs';

const api = new rippleLib.RippleAPI()

export default class Wallet extends Account {

  constructor(options) {
    super({
        publicKey: 'rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe'
    })
    var wallet;

    if (!options) {
      wallet = api.generateAddress();
      this._balance = 0;
    } else {
      if (options._privateKey) return new Wallet({
          privateKey: options._privateKey
      });

      if (rippleLib.RippleAPI._PRIVATE.schemaValidator.isValidSecret(options.privateKey)) {
        var secret = options.privateKey;
        let keypairs = RippleKeypairs.deriveKeypair(secret)
        let address = RippleKeypairs.deriveAddress(keypairs.publicKey)
        wallet = {
          secret: secret,
          address: address
        }

        this._balance = '?';
      } else {
        throw new Errors.InvalidPrivateKey
      }
    }
    this._publicKey = wallet.address;
    this._privateKey = wallet.secret;
  }

  static generate() {
    var wallet = api.generateAddress();
    return new Wallet({ privateKey: wallet.secret });
  }

  get privateKey() {
    return this._privateKey;
  }

  async sendPayment(options) {
    var _this = this;
    var remote = new rippleLib.Remote({
      servers: [
        { host: 's1.ripple.com', port: 443, secure: true }
      ]
    });
    return new Promise(function(resolve, reject) {
      remote.connect(function(err, res) {
        if (err) { return reject(err) }
        remote.setSecret(_this.publicKey, _this.privateKey) 

        remote.createTransaction('Payment', {
          account: _this.publicKey,
          destination: options.to.publicKey,
          amount: options.amount * 1000000
        })
        .submit(function(error, response) {
          remote.disconnect();
          if (error) { return reject(error) };
          resolve(response);
        });
      });
    });
  }
}

