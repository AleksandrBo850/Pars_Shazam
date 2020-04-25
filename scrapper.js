const MongoClient = require("mongodb").MongoClient;
const request = require('request-promise')
const readline = require('readline');
const fs = require('fs');
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

request(`https://www.shazam.com/shazam/v3/en-US/UA/web/-/tracks/country-chart-UA?pageSize=200&startFrom=0`, (err, response, json) => {
    
    if (err) { 
        console.log('Fatal error! Try again after debugg...');
        throw err;
    
    }
    if (!err ) {

        var song = JSON.parse(json);

        console.log('1. Default output in console');
        console.log('2. Output in Mongo database');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });

        rl.question('Select:  ', (answer) => {
            // TODO: Log the answer in a database
            console.log(`You selected: ${answer}`);
            rl.close();

            if (Number(rl['history'][0]) == 1) {
                DefaultOut(song);
            }
            if (Number(rl['history'][0]) == 2) {
                MongoOut(song);
            }
            
          });
          
    }
    
});


function DefaultOut (song) {

    for (var i = 0; i < 200; i++) {

        console.log(`${i+1}. ${song['tracks'][i]['subtitle']}  -  ${song['tracks'][i]['title']}`);
    }

};

function MongoOut (song) {
    
    mongoClient.connect(function(err, client){
      
                    const db = client.db(`database`);
                    const collection = db.collection(`songdatabase`);
                    
        
                    for (var i = 0; i < 200; i++) {
        
                        collection.insertOne({id: `${i+1}`, artist: `${song['tracks'][i]['subtitle']}`, song: `${song['tracks'][i]['title']}`}, function(err, result){
                          
                            if(err){ 
                                return console.log(err);
                            }
                              
                        });
        
                    }
                    console.log("Done!");
                    client.close();


    });

};
