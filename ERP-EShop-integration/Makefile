DC=docker-compose
DR=docker-compose exec -T rabbitmq
DB=docker-compose exec -T backend
DCM=docker-compose exec -T db
WORKER=docker-compose exec -T worker
DW=docker-compose exec -T wordpress

ALIAS?=alias
Darwin:
	sudo ifconfig lo0 $(ALIAS) $(shell awk '$$1 ~ /^DEV_IP/' .env.dist | sed -e "s/^DEV_IP=//")
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
	$(DB) bin/console service:install worker worker:8080
	$(DB) bin/console api-token:create --key "$(shell grep 'ORCHESTY_API_KEY' .env | cut -d "=" -f2)"

docker-down-clean: .env .lo0-down
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
	$(DW) curl -u "root:H8Re ZPFO Pv5s 2JxM 50Ea r3Ze" -X POST  http://127.0.0.10//wp-json/wp/v2/plugins?slug=woocommerce&status=active
