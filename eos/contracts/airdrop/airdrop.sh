eosio-cpp -o airdrop.wasm airdrop.cpp --abigen
cleos set contract hello $PWD -p hello@active
cleos push action hello issue '["hello", 10000]' -p hello@active
cleos get table hello hello accounts
cleos push action hello drop '["dj"]' -p dj@active
cleos get table hello hello accounts
cleos push action hello transfer '["dj", "hello", 50]' -p dj@active
cleos get table hello hello accounts
