#include <eosiolib/eosio.hpp>

using namespace eosio;

class storage : public contract
{
  public:
    // using contract::contract;

    storage(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds), _users(receiver, code.value){}

    [[eosio::action]] void add(name user, std::string full_name)
    {
        require_auth(user);
        print("Hello, ", name{user});
        addName(user, full_name);
    }

    [[eosio::action]] void remove(name user) {
        require_auth(user);
        removeName(user);
    }

    struct [[eosio::table]] user {
        uint64_t key;
        name userName;
        std::string userFullname;
        uint64_t lastUpdate;
        uint64_t primary_key() const { return key; }
    };

    // Configuration
    typedef multi_index<"user"_n, user> userstable;

    userstable _users;

    void addName(name user, std::string full_name)
    {
        bool found = false;
        for (auto &item : _users)
        {
            if (item.userName == user)
            {
                found = true;
                print("modifying user");
                _users.modify(item, user, [&](auto &row) {
                    row.userName = user;
                    row.userFullname = full_name;
                    row.lastUpdate = now();
                });
                break;
            }
        }
        if (!found)
        {
            print("adding user");
            _users.emplace(user, [&](auto &row) {
                row.key = _users.available_primary_key();
                row.userName = user;
                row.userFullname = full_name;
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
            if (item.userName == user)
            {
                print("deleting user");
                _users.erase(item);
                break;
            }
        }
        if (!found)
        {
            print("User does not exist");
        }
    }
};
EOSIO_DISPATCH(storage, (add)(remove))
