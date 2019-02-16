(function (Contract) {
    var web3;
    var instance;

    function init(cb) {
        web3 = new Web3(
            (window.web3 && window.web3.currentProvider) ||
            new Web3.providers.HttpProvider(Contract.endpoint));

        var contract_interface = web3.eth.contract(Contract.abi);
        instance = contract_interface.at(Contract.address);
        cb();
    }

    function getMessage(cb) {
        instance.message(function (error, result) {
            cb(error, result);
        });
    }

    function refreshMessage() {
        getMessage(function(error, result){
            if(error){
                console.error("error when sending tx", error);
                return;
            }
            $('#message').html(result);
        });
    }

    function updateMessage() {
        let newMessage = $('#new-message').val();
        $('#new-message').val('');
        console.log(newMessage);
        if(newMessage && newMessage.length > 0){
            instance.update.sendTransaction(newMessage, {from: "0x95c2332b26bb22153a689ae619d81a6c59e0a804", gas: 30000000}, function(error, result){
                if(error){
                    console.log("error in sendTransaction");
                }
                else{
                    setTimeout(function(){
                        refreshMessage();
                    }, 1000)
                }
            });
        }
        else{
            alert("Newmessage not defined");
        }
    }

    $(document).ready(function () {
          init(function () {
              refreshMessage();
          });
          $('#form-update').submit(function(event) {
              updateMessage();
              event.preventDefault();
          });
      });
})(Contracts['HelloWorld']);
