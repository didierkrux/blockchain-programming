eosio-cpp -o hellostorage.wasm hellostorage.cpp --abigen
cleos set contract hellostorage $PWD -p hello@active
cleos push action hello hi '["dj"]' -p dj@active
