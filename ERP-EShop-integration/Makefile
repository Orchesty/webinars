COMPOSE_FILE=docker-compose.yml
WP_DOMAIN=http://127.0.0.10
WP_PASSWORD=\$$P\$$B25z1NmiRUHkh20JwF1\.Juui7uhWMH0
WP_API_KEY=\$$P\$$Bew81V41ohjMbPAt/TjthEQrPy/1aA0

DC=docker-compose -f $(COMPOSE_FILE)
DR=$(DC) exec -T rabbitmq
DB=$(DC) exec -T backend
DCM=$(DC) exec -T db
DCG=$(DC) exec -T mongo
WORKER=$(DC) exec -T worker
DW=$(DC) exec -T wordpress

ALIAS?=alias
Darwin:
	sudo ifconfig lo0 $(ALIAS) $(shell awk '$$1 ~ /^DEV_IP/' .env | sed -e "s/^DEV_IP=//") || true
Linux:
	@echo 'skipping ...'
.lo0-up:
	-@make `uname`
.lo0-down:
	-@make `uname` ALIAS='-alias'
.env:
	sed -e "s/{DEV_UID}/$(shell if [ "$(shell uname)" = "Linux" ]; then echo $(shell id -u); else echo '1001'; fi)/g" \
		-e "s/{DEV_GID}/$(shell if [ "$(shell uname)" = "Linux" ]; then echo $(shell id -g); else echo '1001'; fi)/g" \
		-e "s|{DOCKER_SOCKET_PATH}|$(shell test -S /var/run/docker-$${USER}.sock && echo /var/run/docker-$${USER}.sock || echo /var/run/docker.sock)|g" \
		-e "s|{PROJECT_SOURCE_PATH}|$(shell pwd)|g" \
		-e 's/{ORCHESTY_API_KEY}/$(shell export LC_CTYPE=C && tr -dc A-Za-z0-9 </dev/urandom | head -c 65)/g' \
		.env.dist > .env; \

init-dev: docker-up-force

# Docker section
docker-up-force: .env .lo0-up
	$(DC) pull --ignore-pull-failures
	$(DC) up -d --force-recreate --remove-orphans
	$(DC) run --rm wait-for-it rabbitmq:15672 -t 600
	$(DR) rabbitmq-plugins enable rabbitmq_consistent_hash_exchange
	$(DB) bin/console doctrine:mongodb:schema:update --dm default
	$(DB) bin/console doctrine:mongodb:schema:update --dm metrics
	$(DB) bin/console mongodb:index:update
	$(DB) bin/console service:install worker worker:8000
	$(DB) bin/console api-token:create --key "$(shell grep 'ORCHESTY_API_KEY' .env | cut -d "=" -f2)"
	$(DB) bin/console user:create "$(shell grep 'ORCHESTY_USER' .env | cut -d "=" -f2)" "$(shell grep 'ORCHESTY_PASSWORD' .env | cut -d "=" -f2)"

docker-down-clean: .env .lo0-down
	docker ps -aq --filter "name=.*topology.*" | xargs docker rm -f || true
	rm -rf ./topology/*
	touch ./topology/.gitkeep
	$(DC) down -v

database-initialize:
	$(DCM) mysql -uroot -proot < ./ERP/init.sql;
	$(DCM) mysql -uroot -proot < ./WooCommerce/init.sql;

docker-stop: .env .lo0-down
	$(DC) down

# Pnpm section
pnpm-install:
	$(WORKER) pnpm install

plugin-initialize:
	$(DW) apt update
	$(DW) apt install less -y
	$(DW) curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
	$(DW) php wp-cli.phar --allow-root core update
	$(DW) php wp-cli.phar --allow-root core update-db
	$(DW) php wp-cli.phar --allow-root plugin install woocommerce --activate
	$(DW) php wp-cli.phar --allow-root plugin install wp-rest-cache --activate
	$(DW) php wp-cli.phar --allow-root theme install storefront --activate
	$(DW) php wp-cli.phar --allow-root wc update

wp-database-replace:
	sed -i "s|http://127.0.0.10|$(WP_DOMAIN)|g" ./WooCommerce/init.sql
	sed -i "s|"\$$P\$$B25z1NmiRUHkh20JwF1\.Juui7uhWMH0"|$(WP_PASSWORD)|g" ./WooCommerce/init.sql
	sed -i "s|"\$$P\$$Bew81V41ohjMbPAt/TjthEQrPy/1aA0"|$(WP_API_KEY)|g" ./WooCommerce/init.sql

install-topology:
	$(DB) bin/console topology:install -c -u --force worker:8000

exampleApp.json:
	cat exampleApp.dist.json > exampleApp.json

import-mongo-data: exampleApp.json
	docker cp ./exampleApp.json erp-eshop-integration-mongo-1:/tmp
	$(DCG) mongoimport --db "$(shell grep 'MAIN_DB' .env | cut -d "=" -f2)" --collection ApplicationInstall --file /tmp/exampleApp.json --jsonArray

fresh-init: docker-down-clean init-dev wp-database-replace database-initialize plugin-initialize install-topology import-mongo-data
