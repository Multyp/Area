PRETTIER = npx prettier
ESLINT = npx eslint

SRC = $(shell find src/ -name "*.js" -or -name "*.jsx" -or -name "*.ts" -or -name "*.tsx" -or -name "*.md")

all: lint format

format:
	$(PRETTIER) --write .

lint:
	$(ESLINT) $(SRC)

clean:
	rm -rf node_modules/.cache

install:
	npm install

.PHONY: all format lint clean install
