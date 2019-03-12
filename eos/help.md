# Installation

## Get the docker image

```sh
docker pull eosio/eos:v1.3.0
```

## Boot Node and Wallet

```sh
sudo docker run --name eosio --publish 7777:7777 --publish 127.0.0.1:5555:5555 --volume /Users/dj/git/blockchain-programming/eos/contracts:/Users/dj/git/blockchain-programming/eos/contracts --detach eosio/eos:v1.3.0 /bin/bash -c "keosd --http-server-address=0.0.0.0:5555 & exec nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::history_plugin --plugin eosio::chain_api_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --plugin eosio::http_plugin -d /mnt/dev/data --config-dir /mnt/dev/config --http-server-address=0.0.0.0:7777 --access-control-allow-origin=* --contracts-console --http-validate-host=false --filter-on='*'"
```

## Check installation

```sh
docker logs --tail 10 eosio
```

## Enter docker container

```sh
docker exec -it eosio bash
```

## Check wallet inside container

```sh
cleos --wallet-url http://127.0.0.1:5555 wallet list keys
```

## Check Nodeos endpoint

```sh
curl http://localhost:7777/v1/chain/get_info
```

## Aliasing Cleos

```sh
alias cleos='docker exec -it eosio /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555'
```

# Run Docker

## Start docker

```sh
docker start eosio
```

## Stop docker

```sh
docker stop eosio
```

# Install build tools

```sh
brew tap eosio/eosio.cdt
brew install eosio.cdt
# or install eosio/eosio.cdt v1.3.0
# brew install https://raw.githubusercontent.com/EOSIO/homebrew-eosio.cdt/37e2912e6ec4d5c9b035a94c3af12f9e1f30927f/eosio.cdt.rb
```

# Wallet

## create wallet

```sh
cleos wallet create --to-console
```

password: PW5JZLcr8eETKJp9SiVQPEikt5HYgSRLLj9vadJGighpbNRuMitEM

## wallet commands

```sh
cleos wallet open
cleos wallet list
cleos wallet unlock
cleos wallet keys
cleos wallet create_key
```

## wallet import

```sh
cleos wallet import
```

PK: 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

## create account

```sh
cleos create account eosio dj EOS7rpxCrmcQG3MSjZSchckrG8brpQq3rGLiCXmwd7c77ULYSmxUk
cleos create account eosio hello EOS7rpxCrmcQG3MSjZSchckrG8brpQq3rGLiCXmwd7c77ULYSmxUk
```

## testnet

https://monitor.jungletestnet.io/

```sh
cleos create key --to-console
didierkrux11
EOS7rcn1PaQAdNaa7vL5cSK4BbWu5bqvFWuuQush7t9cbu8xX1mym
alias cleos='docker exec -it eosio /opt/eosio/bin/cleos --url https://jungle.eosio.cr:443 --wallet-url http://127.0.0.1:5555'
cleos get account didierkrux11
```

## mainnet

https://eosauthority.com/

```sh
alias cleos='docker exec -it eosio /opt/eosio/bin/cleos --url https://api.eosnewyork.io:443 --wallet-url http://127.0.0.1:5555'
```

## scatter

https://get-scatter.com/
