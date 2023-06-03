const AWS = require("aws-sdk");
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new DynamoDB.DocumentClient({region: "us-east-1"});

const isBookAvailable = (book, quantity) => {
  return (book.quantity - quantity) > 0
}

module.exports.checkInventory = async ({bookId, quantity}) => {
  // return "Stocks available";
  try {
    let params = {
      TableName: "bookTable",
      KeyConditionExpression: "bookId = :bookId",
      ExpressionAttributeValues: {
        ":bookId": bookId
      }
    }
    let result = await DocumentClient.query(params).promise();
    let book = result.Items[0];

    if(isBookAvailable(book,quantity)) {
      return book;
    } else {
      let bookOutOfStockError = new Error("the book is out of stock");
      bookOutOfStockError.name = "BookOutOfStock";
      throw bookOutOfStockError;
    }
  } catch(e) {
    if(e.name === "BookOutOfStock") {
      throw e;
    } else {
      let bookNotFoundError = new Error(e);
      bookNotFoundError.name = "BookNotFound";
      throw bookNotFoundError;
    }
  }
};

module.exports.calculateTotal = async (event) => {
  return 100;
};
