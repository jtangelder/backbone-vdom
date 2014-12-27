webpack:
	webpack -w -p

server:
	cd build && python -m SimpleHTTPServer

install:
	sudo npm install webpack -g
	npm install