develop:
	npx cross-env NODE_ENV=development webpack serve --progress

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .

.PHONY: test
