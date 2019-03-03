$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
	var common = nem.model.objects.create("common")("password", "6f24495ceb20791178cd48a4b6f699e91c36abde6401a8e19ec5f8d3eb084b6f");
	var mosaicDefinitions = nem.model.objects.get("mosaicDefinitionMetaDataPair");

    // get list of tx
    var scores = {};
    $.get('http://23.228.67.85:7890/account/transfers/all?address=TANMDRFT2UXMOTL7KWNNUY3S7UJPTIDUZJTDAY3O', function( data ) {
        console.log(data);
        if(data) {
            data.data.map((tx)=> {
                console.log(tx);
                if (tx.transaction.mosaics && tx.transaction.mosaics[0].mosaicId.namespaceId == 'alsace' && tx.transaction.mosaics[0].mosaicId.name =='score') {
                    if(!(tx.transaction.recipient in scores))
                        scores[tx.transaction.recipient]=tx.transaction.mosaics[0].quantity;
                }
            });
            updateScoringTable();
        }
    });

  function roll() {
		var random = Math.floor(Math.random()*1000001);
		console.log(random);
		$("#result").html(random);
  }

  function save() {
		var address = nem.model.address.clean($("#address").val());
		var result = $("#result").html();
		if(!(result >= 0)) return alert("You need to roll the dice!");
		if(scores[address] >= 0 && scores[address]>result) return alert("Not your best score so far.");

  	var transferTransaction = nem.model.objects.get("transferTransaction");

		transferTransaction.amount = 0;

		transferTransaction.recipient = address;

    transferTransaction.message = "Random game";

		var mosaicAttachment = nem.model.objects.create("mosaicAttachment")("alsace", "score", result);

		transferTransaction.mosaics.push(mosaicAttachment);

		nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId).then(function(res){
            var definition = nem.utils.helpers.searchMosaicDefinitionArray(res.data, ["score"]);
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
                preparedTransaction.fee = 500000;

                nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
                    if (res.code >= 2) {
                        alert(res.message);
                    } else {
                        scores[address] = $("#result").html();
                        updateScoringTable();
                    }
                }, function(err){
                    console.log(err);
                });
            }, function(err){
                console.log(err);
            });
          


		}, function(err){
		  console.log(err);
		});
  }

	function updateScoringTable(){
		var list = [];
		for (var key in scores) {
			if (scores.hasOwnProperty(key)) {
					list.push(key + ': ' + scores[key]);
			}
		}
		var highscoreTable = $('#highscoreTable')
		highscoreTable.html('');
		$.each(list, function(i)
		{
				var li = $('<li/>')
						.appendTo(highscoreTable);
				var aaa = $('<span/>')
						.text(list[i])
						.appendTo(li);
		});
	}

	$("#roll").click(function() {
	  roll();
	});
  $("#save").click(function() {
	  save();
	});

});
