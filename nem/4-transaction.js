let nem = require("nem-sdk").default;
require('dotenv').config();
const PASSWORD = process.env.PASSWORD;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const sent_to = "TD57NC-C7UXWB-YW25QN-23DWDD-OHEZXA-EJC7GO-OVJD";

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
let common = nem.model.objects.create("common")(PASSWORD, PRIVATE_KEY);

let transferTransaction = nem.model.objects.create("transferTransaction")(sent_to, 0.1, "Hello World");

let preparedTransaction = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

nem.com.requests.chain.time(endpoint).then(function(time){
    console.log('network time: ', time);

    // fix timestamp bug
    const ts = Math.floor(time.receiveTimeStamp / 1000);
    preparedTransaction.timeStamp = ts;
    const due = 60;
    preparedTransaction.deadline = ts + due * 60;

    nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
        console.log(res);
    }, function(err){
        console.log(err);
    });
}, function(err){
    console.log(err);
});
