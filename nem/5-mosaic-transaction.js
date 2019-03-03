let nem = require("nem-sdk").default;
require('dotenv').config();
const PASSWORD = process.env.PASSWORD;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const sent_to = "TD57NC-C7UXWB-YW25QN-23DWDD-OHEZXA-EJC7GO-OVJD";

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
let common = nem.model.objects.create("common")(PASSWORD, PRIVATE_KEY);

let transferTransaction = nem.model.objects.create("transferTransaction")(sent_to, 1, "Sent mosaic");

var mosaicDefinitions = nem.model.objects.get("mosaicDefinitionMetaDataPair");

var mosaicAttachment = nem.model.objects.create("mosaicAttachment")("alsace", "hk", 100);

transferTransaction.mosaics.push(mosaicAttachment);

nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId).then(function(res){
    var definition = nem.utils.helpers.searchMosaicDefinitionArray(res.data, ["hk"]);
    var fullName = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaicId);
    mosaicDefinitions[fullName] = {};
    mosaicDefinitions[fullName].mosaicDefinition = definition[fullName];

    var preparedTransaction = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, mosaicDefinitions, nem.model.network.data.testnet.id);

    // fix timestamp bug
    nem.com.requests.chain.time(endpoint).then(function(time){
        const ts = Math.floor(time.receiveTimeStamp / 1000);
        preparedTransaction.timeStamp = ts;
        const due = 60;
        preparedTransaction.deadline = ts + due * 60;

        // fix fee bug
        preparedTransaction.fee = 1000000;

        nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
            console.log(res);
        }, function(err){
            console.log(err);
        });
    }, function(err){
        console.log(err);
    });
}, function(err){
  console.log(err);
});
