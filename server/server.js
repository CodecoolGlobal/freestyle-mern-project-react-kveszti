import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "./model/User.js";
import Stats from "./model/Stats.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.CONSTRING).then(app.listen(3000, () => {
  console.log("Server running on: http://localhost:3000")
})).catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("hi")
});

app.post("/api/users/all", async (req, res) => {
  try {
    const { username, email, password } = req.body;



    const createdAt = Date.now();
    const user = new User({
      username,
      email,
      password,
      createdAt,
    });
    await user.save();
    const userID = user._id;
    const userStats = new Stats({
      username,
      userID,
      createdAt
    })
    await userStats.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Failed to register please try again' });
  }
})

app.patch("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email: email })
    if (user) {
      if (user.password === password) {
        res.status(201).json({
          success: true, data: {
            username: user.username,
            userID: user._id,
            email: user.email,
            password: user.password,
            birthday: user.birthday ? user.birthday : 'N/A',
            gender: user.gender ? user.gender : 'N/A',
          }
        })
      } else {
        res.status(201).json({ success: false, error: "Password is incorrect." })
      }
    } else {
      res.status(404).json({ success: false, error: 'User not found.' })
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Failed to register please try again' });
  }
})

app.patch("/api/users/edit/id/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    // const userStats = await User.findOne({ userID: id });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    // if (!userStats) {
    //   return res.status(404).json({ success: false, error: 'Userstats not found' });
    // }
    if (req.body.password) {
      const { password } = req.body;
      user.password = password;
    } else if (req.body.username) {
      const { username, email, birthday, gender } = req.body;
      user.username = username;
      user.email = email;
      user.birthday = birthday;
      user.gender = gender;
      // userStats.username = username;
    }

    await user.save();
    //await userStats.save();
    console.log(`app.patch  user:`, user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
})

app.patch("/api/users/id/:id/stats", async (req, res) => {
  const id = req.params.id;
  try {
    let userStats = await Stats.findOne({ userID: id });
    if (!userStats) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }


    const name = req.body.name;
    const points = req.body.points;
    console.log(req.body);

    let categoryFound = false;
    if (userStats.stats.length !== 0) {
      for (let i = 0; i < userStats.stats.length; i++) {
        if (userStats.stats[i].category.name === name) {
          userStats.stats[i].category.points += points;
          categoryFound = true; // Mark category as found
          break; // Exit loop after updating points
        }
      }
    }

    if (!categoryFound) {
      userStats.stats.push({ category: { name: name, points: points } });
    }

    const totalCategory = userStats.stats.find(stat => stat.category.name === "total");
    if (totalCategory) {
      totalCategory.category.points += points;
    } else {
      userStats.stats.push({ category: { name: "total", points: points } });
    }

    await userStats.save();
    console.log(`app.patch  user:`, userStats);
    res.status(200).json({ success: true, user: userStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
})


app.get("/api/users/id/:id/stats", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    let userStats = await Stats.findOne({ userID: id });
    if (!userStats) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    console.log(userStats)
    res.status(200).json({ success: true, user: userStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
})



app.delete("/api/users/edit/id/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result1 = await User.deleteOne({ _id: id });
    const result2 = await Stats.deleteOne({ userID: id });
    console.log(result1, result2);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
})

app.get("/api/users/stats", async (req, res) => {
  const statistics = await Stats.find();
  return res.json(statistics);
})