$(document).ready(function () {
    var nem = require("nem-sdk").default;
    var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

    var loggedInAccount = "";
    var savedAccounts = window.localStorage.getItem("nem-bank-accounts");
    var accounts;
    if (savedAccounts !== null) {
        accounts = JSON.parse(savedAccounts);
    }
    else {
        accounts = {};
    }

    function login() {
        var address = nem.model.address.clean($("#address").val());
        if (!nem.model.address.isValid(address)) return alert('Address not valid');
        if (accounts[address] === undefined) {
            accounts[address] = {};
            var randomBytes = nem.crypto.nacl.randomBytes(32);
            var privateKey = nem.utils.convert.ua2hex(randomBytes);
            var keyPair = nem.crypto.keyPair.create(privateKey);
            var bankAddress = nem.model.address.toAddress(keyPair.publicKey.toString(), nem.model.network.data.testnet.id);

            var newAccount = {
                privateKey: privateKey,
                keyPair: keyPair,
                bankAddress: bankAddress,
                privateAddress: address,
                balance: 0
            }

            accounts[address] = newAccount;
            window.localStorage.setItem("nem-bank-accounts", JSON.stringify(accounts));
        }
        loggedInAccount = address;
        refreshBalance();

        $("#loginWrapper").hide();
        $("#bankAddress").html(accounts[address].bankAddress);
        $("#dashboard").show();
    }

    function refreshBalance() {
        nem.com.requests.account.data(endpoint, accounts[loggedInAccount].bankAddress).then(function (res) {
            accounts[loggedInAccount].balance = res.account.balance / 1000000;
            $("#balance").html(accounts[loggedInAccount].balance);
        }, function (err) {
            alert("error getting the balance");
        });
    }

    function withdraw() {
        var withdrawAmount = $("#withdrawAmount").val();
        if (withdrawAmount === "" || !nem.utils.helpers.isTextAmountValid(withdrawAmount) || !(withdrawAmount>0)) return alert("Error in input");

        var transferTransaction = nem.model.objects.get("transferTransaction");
        var common = nem.model.objects.create("common")();
        common.privateKey = accounts[loggedInAccount].privateKey;

        transferTransaction.amount = nem.utils.helpers.cleanTextAmount(withdrawAmount);
        transferTransaction.recipient = nem.model.address.clean(accounts[loggedInAccount].privateAddress);
        transferTransaction.message = "Nem bank withdrawal";

        var preparedTransaction = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

        // fix timestamp bug
        nem.com.requests.chain.time(endpoint).then(function (time) {
            const ts = Math.floor(time.receiveTimeStamp / 1000);
            preparedTransaction.timeStamp = ts;
            const due = 60;
            preparedTransaction.deadline = ts + due * 60;

            nem.model.transactions.send(common, preparedTransaction, endpoint).then(function (res) {
                if (res.code >= 2) {
                    alert(res.message);
                }
                else {
                    alert("tx: " + res.message);
                }
            }, function (err) {
                alert(err);
            })
        }, function (err) {
            console.log(err);
        });
    }


    $("#login").click(function () {
        login();
    });
    $("#refresh_balance").click(function () {
        refreshBalance();
    });
    $("#withdraw").click(function () {
        withdraw();
    });
});
