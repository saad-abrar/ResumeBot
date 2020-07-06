require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

var MongoHelper = {
    client: null,
    dbo: null,
    openConnection: async function(){
        this.client = await this.connectToMongo();
        this.dbo = await this.selectDb(this.client);
        return this.dbo;
    },
    closeConnection: async function(){
        this.client.close();
    },
    connectToMongo: function () {
        return MongoClient.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true
        }).then(client => {
            console.log('mongo connection establised');
            return client;
        }).catch(err => {
            console.log(err);
            return null;
        });
    },
    selectDb: function (client) {
        var dbo = client.db(process.env.DBNAME);
        console.log('db selected');
        return dbo;
    },
    insertObjectToCollection: async function (dbo, query, object) {
        var collection = dbo.collection(process.env.COLLECTIONNAME);
        var response = await this.findObject(dbo, query);
        if (response === null){
            return collection.insertOne(object)
            .then(res => {
                console.log('inserted');
                return 'success';
            })
            .catch(err => {
                console.log(err);
                return 'failure';
            });
        }
        else {
            return 'success 2';
        }
    },
    findObject: function (dbo, object) {
        var collection = dbo.collection(process.env.COLLECTIONNAME);
        return collection.findOne(object).then(res => {
            return res;
        }).catch(err => {
            console.log(err);
            return null;
        });
    },
    updateObject: function(dbo, query, object) {
        return dbo.collection(process.env.COLLECTIONNAME).updateOne(query, object)
        .then(res => {
            console.log('up');
            return 'success'
        })
        .catch(err => {
            console.log(err);
            return 'failure'
        });
    },
    deleteObject: function(dbo, query) {
        return dbo.collection(process.env.COLLECTIONNAME).deleteOne(query)
        .then(res => {
            console.log('dl');
            return 'success'
        })
        .catch(err => {
            console.log('fai');
            return 'failure'
        });
    }
}

module.exports = {
    MongoHelper: MongoHelper
};