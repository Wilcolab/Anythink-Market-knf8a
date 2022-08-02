//TODO: seeds script should come here, so we'll be able to put some data in our local env

const mongoose = require("mongoose");

const User = mongoose.model("User", require("../models/User"));
const Comment = mongoose.model("Comment", require("../models/Comment"));
const Item = mongoose.model("Item", require("../models/Item"));

if (!process.env.MONGODB_URI) {
  console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}

mongoose.connect(process.env.MONGODB_URI).then((conn) => {
  console.log("Mongo connected");

  for (let i = 1; i < 100; i++) {
    let user = new User({
      username: `fakeUser${i}`,
      email: `fakeEmail${i}@anythink.com`,
      bio: "test bio",
      image: "https://picsum.photos/200",
      role: i % 5 === 0 ? "admin" : "user",
      favorites: [],
      following: [],
    });
    
    let item = new Item({
      slug: `fakeItem${i}`,
      title: `Fake item ${i}`,
      description: 'testing items',
      image: 'https://picsum.photos/200',
      tagList: ['test',`tag ${i%5}`],
      seller: user._Id,
      comments:[]
    });

    let comment=new Comment({
        body: 'Fake comment from fakeUser'+i,
        seller: user._Id,
        item: item._id
    })

    item.comments.push(comment._id);

    user.save().then(data=>{
      if(data) console.log(data);
    });
    item.save().then(data=>{
      if(data) console.log(data);
    });
    comment.save().then(data=>{
      if(data) console.log(data);
    });
  }
});

// const saveData = async()=>{

// }
