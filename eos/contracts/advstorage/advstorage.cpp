#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

using namespace eosio;
using std::string;

class advstorage : public contract
{
  public:
    // using contract::contract;

    advstorage(eosio::name receiver, eosio::name code, eosio::datastream<const char *> ds) : eosio::contract(receiver, code, ds), _users(receiver, code.value){}

    [[eosio::action]] void hi(name user, string full_name)
    {
        require_auth(user);
        print("Hello, ", name{user});
        addName(user, full_name);
    }

    [[eosio::action]] void forget(name user) {
        require_auth(user);
        removeName(user);
    }

    struct [[eosio::table]] user {
        uint64_t key;
        name name;
        string full_name;
        uint64_t lastUpdate;
        uint64_t primary_key() const { return key; }
    };

    // Configuration
    typedef eosio::multi_index<"user"_n, user> userstable;

    userstable _users;

    void addName(name user, string full_name)
    {
        bool found = false;
        for (auto &item : _users)
        {
            if (item.name == user)
            {
                found = true;
                eosio::print("modifying user");
                _users.modify(item, user, [&](auto &row) {
                    row.name = user;
                    row.full_name = full_name;
                    row.lastUpdate = now();
                });
                break;
            }
        }
        if (!found)
        {
            eosio::print("adding user");
            _users.emplace(user, [&](auto &row) {
                row.key = _users.available_primary_key();
                row.name = user;
                row.full_name = full_name;
                row.lastUpdate = now();
            });
        }
    }

    void removeName(name user)
    {
        bool found = false;
        for (auto &item : _users)
        {
            found = true;
            if (item.name == user)
            {
                eosio::print("deleting user");
                _users.erase(item);
                break;
            }
        }
        if (!found)
        {
            eosio::print("User does not exist");
        }
    }
};
EOSIO_DISPATCH(advstorage, (hi)(forget))
