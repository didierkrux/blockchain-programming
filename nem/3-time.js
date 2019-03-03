let nem = require("nem-sdk").default;

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

nem.com.requests.chain.time(endpoint).then(function(time){
  console.log('network time: ', time);
}, function(err){
  console.log(err);
});
