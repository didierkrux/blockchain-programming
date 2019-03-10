eosio-cpp -o hello.wasm hello.cpp --abigen
cleos set contract hello $PWD -p hello@active
cleos push action hello hi '["dj"]' -p dj@active
