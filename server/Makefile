TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)
REGISTRY = http://registry.npmjs.com
REPORTER = spec
TIMEOUT = 3000
MOCHA_OPTS =

start:
	@node --harmony ./app.js

install:
	@npm install \
		--registry=$(REGISTRY)

jshint:
	@./node_modules/.bin/jshint .

clean:
	@rm -rf node_modules
	@rm -rf coverage

autod: install
	@./node_modules/.bin/autod \
		--registry=$(REGISTRY) \
		-w \
		-f "~"
	@$(MAKE) install

.PHONY: start install clean autod