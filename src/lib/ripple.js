const RippleAPI = require("ripple-lib").RippleAPI;

function parseXRPBalance(balances) {
  
  var balance = undefined;

  balances.forEach(b => {
    if (b.currency === "XRP") {
      balance = parseFloat(b.value)
    }
  })

  return balance;
}

module.exports.getBalance = function(address) {

	return new Promise(async (resolve, reject) => {
		const ripple = new RippleAPI({server: 'wss://s1.ripple.com:443'});

		try {
			await ripple.connect()


			let balances = await ripple.getBalances(address)
			let balance = parseXRPBalance(balances);
			ripple.disconnect();
			resolve(balance)

		} catch(error) {
				console.log('error fetching balance', error.message)
				ripple.disconnect();
				resolve(0)
		}
	})
}
