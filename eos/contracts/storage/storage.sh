eosio-cpp -o storage.wasm storage.cpp --abigen
cleos set contract hello $PWD -p hello@active
# adding
cleos push action hello add '["dj", "Didier Krux"]' -p dj@active
# modifying
cleos push action hello add '["dj", "Didier2 Krux2"]' -p dj@active
# other
cleos push action hello add '["hello", "Hello World"]' -p hello@active
# remove
cleos push action hello remove '["hello"]' -p hello@active
cleos get table hello hello users
