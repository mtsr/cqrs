curl -X POST -H "Content-Type: application/json" http://localhost:3000/Chat/3/sendMessage -d '{ "sender": 1, "message": "bla, bla, bla" }'
curl -X POST -H "Content-Type: application/json" http://localhost:3000/Chat/3/sendMessage -d '{ "sender": 2, "message": "bla terug" }'