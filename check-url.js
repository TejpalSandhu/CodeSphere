const fs = require('fs');
fetch('https://code-sphere-kappa-seven.vercel.app/assets/index-BACh3hQH.js')
  .then(r => r.text())
  .then(t => {
    const match = t.match(/https:\/\/codesphere-api[^\"]+/g);
    console.log("MATCHES:", match);
  });
