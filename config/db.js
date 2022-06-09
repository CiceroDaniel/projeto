if(process.env.NODE_ENV == "production"){
  module.exports = {mongoURI: "mongodb+srv://daniel:da1227@cluster0.imgykqg.mongodb.net/?retryWrites=true&w=majority"}
}else{
  module.exports == {mongoURI: "mongodb://localhost/restaurante"}
}