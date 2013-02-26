curl -X POST -H "Content-Type: application/json" http://localhost:3001/Chat/3/sendMessage -d '{ "authorID": "1", "author": "Jonas", "content": "bla, bla, bla", "ts": "100000000" }'
curl -X POST -H "Content-Type: application/json" http://localhost:3001/Chat/3/sendMessage -d '{ "authorID": "2", "author": "Eelke", "content": "bla terug", "ts": "200000000" }'
