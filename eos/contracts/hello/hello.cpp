#include <eosiolib/eosio.hpp>

using namespace eosio;

class[[eosio::contract("hello")]] hello : public contract
{
  public:
    using contract::contract;

    [[eosio::action]] void hi(name user) {
        require_auth(user);
        print("Hello, ", user);
    }
};

EOSIO_DISPATCH(hello, (hi))
