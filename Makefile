webpack:
	webpack -w -d

server:
	cd build && python -m SimpleHTTPServer

install:
	sudo npm install webpack -g
	npm install