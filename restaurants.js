const RESTAURANTS_TABLE = "restaurants"

module.exports = {
    // performs a DynamoDB Scan operation to extract all of the records in the table
    getRestaurants: function(filters, ddbClient, callback) {
        ddbClient.scan({ TableName: RESTAURANTS_TABLE }, function(err, data) {
            if (err) {
                console.log(err);
                callback(500, {
                    message: "Could not load restaurants"
                }).end();
            } else {
                callback(200, data['Items']);
            }
        })
    },

    getRestaurant: function(restaurantId, ddbClient, callback) {
       if (!restaurantId) {
           callback(400, {
               message: "Invalid restaurant ID"
           });
       }
       ddbClient.get({
           TableName: RESTAURANTS_TABLE,
           Key: {
               id: restaurantId
           }
       }, function(err, data) {
           if (err) {
               console.log(err);
               callback(500, {
                   message: "Could not load restaurant"
               });
           } else {
               if (data['Item']) {
                   callback(200, data['Item']);
               } else {
                   callback(404, {
                       message: "The restaurant does not exist"
                   });
               }
           }
       });
   }
}
