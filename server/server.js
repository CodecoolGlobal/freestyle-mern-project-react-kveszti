import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "./model/User.js";
import Stats from "./model/Stats.js";
import GameHistory from "./model/GameHistory.js";
import Question from "./model/Questions.js";
import CategoryTitle from "./model/CategoryTitle.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.CONSTRING).then(app.listen(3000, () => {
  console.log("Server running on: http://localhost:3000")
})).catch(err => console.log(err));


let currentStreak = 0;
let currentStreakThroughGames = 0;

app.get("/", (req, res) => {
  res.send("hi")
});

app.get("/api/userHistory/id/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    const games = await GameHistory.find({ user: userId });
    games.forEach(game => {
      if (!user.playedGames.includes(game._id)) {
        user.playedGames.push(game._id);
      }
    });
    await user.save();
    user.populate("playedGames").then(user => res.json({ success: true, user: user }));

  } catch (err) {
    console.error("Error while fetching game history for user.", err)
  }
});

app.get("/api/gameHistory/id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const gameHistory = await GameHistory.findOne({ _id: id });
    gameHistory.populate("questionsAndAnswers").then(gameHistory => res.json({ success: true, gameHistory: gameHistory }))
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err });
  }
})

app.patch("/api/gameover/gameID/:id", async (req, res) => {
  const id = req.params.id;
  const game = await GameHistory.findOne({ _id: id });

  game.finished = true;
  await game.save();
  res.json({ success: true, game: game });
})

app.post("/api/users/all", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailCheck = await User.findOne({ email: email })
    const usernameCheck = await User.findOne({ username: username })
    let user;
    if (emailCheck) {
      return res.status(409).json({ success: false, error: 'Email already in use.' });
    } else if (usernameCheck) {
      return res.status(409).json({ success: false, error: 'Username already in use.' });
    } else {
      const createdAt = Date.now();
      user = new User({
        username,
        email,
        password,
        createdAt,
      });
      await user.save();
      const user = user._id;
      const userStats = new Stats({
        user,
        createdAt
      })
      await userStats.save();
    }
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: 'Failed to register please try again' });
  }
})

app.post("/api/gamehistory", async (req, res) => {
  currentStreak = 0;
  try {
    const { user, gameMode } = req.body;
    const createdAt = Date.now();
    const finished = false;
    const gainedPoints = 0;
    const correctAnswers = 0;
    const allAnswers = 0;
    const longestGoodAnswerStreak = 0;


    const gameHistory = new GameHistory({
      user,
      createdAt,
      finished,
      gainedPoints,
      correctAnswers,
      allAnswers,
      longestGoodAnswerStreak,
      gameMode

    });
    await gameHistory.save();
    res.status(201).json({ success: true, gameHistory });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Failed to save gamehistory pls try again' });
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
  const user = await User.findById(id);
  try {
    let userStats = await Stats.findOne({ userID: id });
    if (!userStats) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const name = req.body.name;
    const points = req.body.points;
    const { game, question, isCorrect, difficulty, category, "correct_answer": correctAnswer, "incorrect_answers": incorrectAnswers, choosenAnswer } = req.body.question;


    console.log(req.body)

    const questionObject = new Question({
      game,
      question,
      isCorrect,
      difficulty,
      category,
      "correct_answer": correctAnswer,
      "incorrect_answers": incorrectAnswers,
      choosenAnswer,
      points
    });

    await questionObject.save();

    const gameHistoryObject = await GameHistory.findOne({ _id: game });
    if (!gameHistoryObject) {
      return res.status(404).json({ success: false, error: 'Game history not found' });
    }
    gameHistoryObject.questionsAndAnswers.push(questionObject._id);
    gameHistoryObject.gainedPoints += points;
    if (isCorrect) {
      gameHistoryObject.correctAnswers++
    };
    gameHistoryObject.allAnswers++;

    if (isCorrect) {
      currentStreak++;
      currentStreakThroughGames++;
      if (gameHistoryObject.longestGoodAnswerStreak < currentStreak) {
        gameHistoryObject.longestGoodAnswerStreak = currentStreak;
      }
      if (user.longestStreakOneGame < currentStreak) {
        user.longestStreakOneGame = currentStreak;
      }
      if (user.longestStreakThroughGames < currentStreakThroughGames) {
        user.longestStreakThroughGames = currentStreakThroughGames;
      }
    } else {
      currentStreak = 0;
      currentStreakThroughGames = 0;
    }


    await gameHistoryObject.save();

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
//ez lesz majd a mystatshoz
// app.get("/api/user/id/:id", async (req, res) => {
//   const id = req.params.id;

//   try {
//     const user = await User.findOne({ _id: id });

//   } catch (err) {
//     console.error("Error while fetching user data", err)
//   }
// })


app.get("/api/users/id/:id/stats", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    let userStats = await Stats.findOne({ userID: id }).populate("user");
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