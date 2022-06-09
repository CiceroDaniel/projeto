if(process.env.NODE_ENV == "production"){
  module.exports = {mongoURI: "mongodb+srv://daniel:daniel1227@daniel.j2n4iws.mongodb.net/?retryWrites=true&w=majority"}
}else{
  module.exports == {mongoURI: "mongodb://localhost/restaurante"}
}