function getBoltOptions() {
  return {
    key: '<PAYU_KEY>', // copy from https://www.payumoney.com/merchant-dashboard/#/integration
    amount: '1',
    firstname: 'Username',
    email: 'test@test.com',
    phone: '9999881223',
    productinfo: 'Jeans',
    surl : 'https://sucess-url.in',
    furl: 'https://fail-url.in',
  }
}


function generateHash() {
  return fetch('/generate-hash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(getBoltOptions())
  }).then(response => response.json());
}


function verifyHash(params) {
  return fetch('/verify-hash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  }).then(response => response.json());
}


document.querySelector('#submit').addEventListener('click', function(evt) {
  generateHash().then((response) => {
    const boltOptions = Object.assign(getBoltOptions(), { hash: response.hash, txnid: response.txnid });
    bolt.launch(boltOptions, {
      responseHandler: (BOLT) => {
        verifyHash(BOLT.response).then((response) => {
          if(!response.isValidHash) {
            window.alert('Transaction Failed');
          }
        })
      },
      catchException: BOLT => window.alert(BOLT.message),
    });
  })
});
