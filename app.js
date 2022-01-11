const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view-engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/happilyeverDB", {useNewUrlParser: true});

const profileSchema = {
  name: String,
  dob: String,  
  status: {
    type: String,
    default: "Active"
  }
};

const Profile = mongoose.model("Profile", profileSchema);

app.route("/profiles")

.get(function(req, res){
  Profile.find(function(err, foundProfiles){
    try {
      if(!err){
        res.send(foundProfiles);
      }

    } catch (err) {
      res.send(err);
    }
    // if(!err){
    //   res.send(foundProfiles);
    // }
    // else{
    //   res.send(err);
    // }

  })
})



.post(function(req, res){
  const newProfile = new Profile({
    name: req.body.name,
    dob: req.body.dob,
    status: req.body.status
  });
  newProfile.save(function(err){
    if(!err){
      res.send("Successfully added a new profile.");
    }else{
      res.send(err);
    }
  });
});

app.get("/paused-profiles", function(req, res){
  Profile.find({status:"Paused"}, function(err, foundProfiles){
    if(!err){
      res.send(foundProfiles);
    }else{
      res.send(err);
    }
  })
});

app.patch("/profiles/pause/:profileName", function(req, res){
  Profile.updateOne(
    {name: req.params.profileName},
    {status: "Paused"},
    function(err){
      if(!err){
        res.send("Successfully paused a profile.");
      }else{
        res.send(err);
      }
    }
  );
});

app.patch("/profiles/unpause/:profileName", function(req, res){
  Profile.updateOne(
    {name: req.params.profileName},
    {status: "Active"},
    function(err){
      if(!err){
        res.send("Successfully unpaused a profile.");
      }else{
        res.send(err);
      }
    }
  );
});

app.delete("/profiles/:profileName", function(req, res){
  Profile.deleteOne(
    {name: req.params.profileName},
    function(err){
      if(!err){
        res.send("Successfully deleted a profile.");
      }else{
        res.send(err);
      }
    }
  );
});


app.listen(3000, function(){
  console.log("Server started at port 3000");
});
