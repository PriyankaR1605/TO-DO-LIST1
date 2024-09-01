const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/toDoListDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
    name: String,
};


const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Sample Item"
});

const defaultArray = [item1];

const listScheme = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listScheme);

app.get("/", function (req, res) {


    Item.find({}, function (err, result) {

        if (result.length === 0) {
            Item.insertMany(defaultArray)
            res.redirect("/");
        }
        else {
            console.log(result);
            res.render("list", { ListTitle: "Today", newItem: result });
        }
    });

});

app.post("/", function (req, res) {

    const itemName = req.body.addItem;

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");
});


app.post("/delete", function (req, res) {
    const id = req.body.chkbox;

    Item.deleteOne({ _id: id }, function () { console.log("Success"); })
    res.redirect("/");

});

app.listen(3000, function () {
    console.log("Server is up");
});