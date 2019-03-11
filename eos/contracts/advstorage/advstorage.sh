eosio-cpp -o advstorage.wasm advstorage.cpp --abigen
cleos set contract hello $PWD -p hello@active
# adding
cleos push action hello hi '["dj", "Didier Krux"]' -p dj@active
# modifying
cleos push action hello hi '["dj", "Didier2 Krux2"]' -p dj@active
# other
cleos push action hello hi '["hello", "Hello World"]' -p hello@active
# other
cleos push action hello forget '["hello"]' -p hello@active
cleos get table hello hello user
