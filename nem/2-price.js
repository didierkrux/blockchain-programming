let nem = require("nem-sdk").default;

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

nem.com.requests.market.xem(endpoint).then(function(market){
  console.log('current market price: ', market);
}, function(err){
  console.log(err);
});
