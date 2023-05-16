APP?=''

NAME?=''

COMPONENT?=''

SERVICE?=''





db-migrate: ## Faire du migrate
	


db-inspect: ## Inspect db
	

db-flush: ## Flush database
	

load-test:
	
##Angular
ng-add: ##Adds support for an external library to your project.
	docker-compose run --rm web ng add $(NAME)

ng-analytics: ##Configures the gathering of Angular CLI usage metrics. See https://angular.io/cli/usage-analytics-gathering.
	docker-compose run --rm web ng analytics

ng-build: ##(b) Compiles an Angular app into an output directory named dist/ at the given output path. Must be executed from within a workspace directory.
	docker-compose run --rm web ng build

ng-deploy: ##Invokes the deploy builder for a specified project or for the default project in the workspace.
	docker-compose run --rm web ng deploy

ng-config: ##Retrieves or sets Angular configuration values in the angular.json file for the workspace.
	docker-compose run --rm web ng config

ng-doc: ##(d) Opens the official Angular documentation (angular.io) in a browser, and searches for a given keyword.
	docker-compose run --rm web ng doc

ng-e2e: ##(e) Builds and serves an Angular app, then runs end-to-end tests using Protractor.
	docker-compose run --rm web ng e2e

ng-generate-component: ##(g) Generates and/or modifies files based on a schematic.
	docker-compose run --rm web ng generate component $(COMPONENT)

ng-generate-service: ##(g) Generates and/or modifies files based on a schematic.
	docker-compose run --rm web ng generate service $(SERVICE)
	
ng-generate-module: ##(g) Generates and/or modifies files based on a schematic.
	docker-compose run --rm web ng g module $(MODULE) --routing

ng-help: ##Lists available commands and their short descriptions.
	docker-compose run --rm web ng help

ng-lint: ##(l) Runs linting tools on Angular app code in a given project folder.
	docker-compose run --rm web ng lint

ng-new: ##(n) Creates a new workspace and an initial Angular app.
	docker-compose run --rm web ng new

ng-run: ##Runs an Architect target with an optional custom builder configuration defined in your project.
	docker-compose run --rm web ng run

ng-serve: ##(s) Builds and serves your app, rebuilding on file changes.
	docker-compose run --rm web ng serve

ng-test: ##(t) Runs unit tests in a project.
	docker-compose run --rm web ng test

ng-update: ##Updates your application and its dependencies. See https://update.angular.io/
	docker-compose run --rm web ng test

ng-version: ##(v) Outputs Angular CLI version.
	docker-compose run --rm web ng version
	
ng-xi18n: ##(i18n-extract) Extracts i18n messages from source code.
	docker-compose run --rm web ng xi18n

restart-service:
	sudo docker-compose restart

#web
npm-install: #install npm
	docker-compose run --rm web npm install
