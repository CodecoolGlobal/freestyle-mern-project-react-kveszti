import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import User from "./model/User.js";
import Stats from "./model/Stats.js";
import GameHistory from "./model/GameHistory.js";
import Question from "./model/Questions.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

dotenv.config();

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, error: "No token provided" });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.CONSTRING).then(app.listen(3000, () => {
    console.log("Server running on: http://localhost:3000")
})).catch(err => console.log(err));


let currentStreak = 0;
let currentStreakThroughGames = 0;


app.get("/", (req, res) => {
    res.send("hi")
});

app.get("/api/userHistory", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findOne({_id: userId});
        const games = await GameHistory.find({user: userId});
        games.forEach(game => {
            if (!user.playedGames.includes(game._id)) {
                user.playedGames.push(game._id);
            }
        });
        await user.save();
        user.populate("playedGames").then(user => res.json({success: true, user: user}));

    } catch (err) {
        console.error("Error while fetching game history for user.", err)
    }
});

app.get("/api/gameHistory/id/:id", authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const gameHistory = await GameHistory.findOne({_id: id});
        gameHistory.populate("questionsAndAnswers").then(gameHistory => res.json({
            success: true,
            gameHistory: gameHistory
        }))
    } catch (err) {
        console.error(err);
        res.json({success: false, error: err});
    }
})

app.patch("/api/gameover/gameID/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    const game = await GameHistory.findOne({_id: id});

    game.finished = true;
    await game.save();
    res.json({success: true, game: game});
})

app.post("/api/users/all", async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const emailCheck = await User.findOne({email: email})
        const usernameCheck = await User.findOne({username: username})
        let user;
        if (emailCheck) {
            return res.status(409).json({success: false, error: 'Email already in use.'});
        } else if (usernameCheck) {
            return res.status(409).json({success: false, error: 'Username already in use.'});
        } else {
            const createdAt = Date.now();
            const longestStreakOneGame = 0;
            const longestStreakThroughGames = 0;
            const collectedTitles = [];
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            user = new User({
                username,
                email,
                hashedPassword,
                createdAt,
                longestStreakOneGame,
                longestStreakThroughGames,
                collectedTitles
            });
            await user.save();
            const userRef = user._id;
            const userStats = new Stats({
                userRef,
                createdAt
            })
            await userStats.save();
        }
        const {hashedPassword, ...userWithoutPassword} = user._doc;
        res.status(201).json({success: true, user: userWithoutPassword});
    } catch (error) {
        console.error(error);
        res.status(400).json({success: false, error: 'Failed to register please try again'});
    }
})

app.post("/api/gamehistory", authenticateToken, async (req, res) => {
    currentStreak = 0;
    const user = req.user.userId;
    try {
        const {gameMode, category, difficulty} = req.body;
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
            gameMode,
            category,
            difficulty

        });
        await gameHistory.save();
        res.status(201).json({success: true, gameHistory});
    } catch (err) {
        console.error(err);
        res.status(400).json({success: false, error: 'Failed to save gamehistory pls try again'});
    }
})

app.patch("/api/users/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email})
        if (user) {
            const match = bcrypt.compare(password, user.hashedPassword);
            if (match) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', token, {
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    maxAge: 3600000, 
                });
                res.status(201).json({
                    success: true, message: "Login successful!"
                });
            } else {
                res.status(401).json({success: false, error: "Password is incorrect."})
            }
        } else {
            res.status(404).json({success: false, error: 'User not found.'})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({success: false, error: 'Failed to register please try again'});
    }
})

app.patch("/api/users/edit", authenticateToken, async (req, res) => {
    const id = req.user.userId;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({success: false, error: 'User not found'});
        }
        if (req.body.password) {
            const match = bcrypt.compare(req.body.oldPassword, user.hashedPassword);
            if(match){
                const {password} = req.body;
                user.password = password;
            } else {
                return res.status(400).json({success:false, message: "Old password invalid"})
            }
            
        } else if (req.body.username) {
            const {username, email, birthday, gender} = req.body;
            user.username = username;
            user.email = email;
            user.birthday = birthday;
            user.gender = gender;
        }

        await user.save();
        res.status(200).json({success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Failed to update user'});
    }
})

app.patch("/api/users/myStats", authenticateToken, async (req, res) => {
    const id = req.user.userId;
    const user = await User.findById(id);
    try {
        let userStats = await Stats.findOne({userRef: id});
        if (!userStats) {
            return res.status(404).json({success: false, error: 'User not found'});
        }

        const name = req.body.name;
        let points = req.body.points;
        const {
            game,
            question,
            isCorrect,
            difficulty,
            category,
            "correct_answer": correctAnswer,
            "incorrect_answers": incorrectAnswers,
            choosenAnswer
        } = req.body.question;

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

        const gameHistoryObject = await GameHistory.findOne({_id: game});
        if (!gameHistoryObject) {
            return res.status(404).json({success: false, error: 'Game history not found'});
        }
        gameHistoryObject.questionsAndAnswers.push(questionObject._id);
        gameHistoryObject.gainedPoints += points;

        if (gameHistoryObject.gainedPoints < 0) {
            gameHistoryObject.gainedPoints = 0;
        }
        if (isCorrect) {
            gameHistoryObject.correctAnswers++
        }
        ;
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

        await user.save();
        await gameHistoryObject.save();

        let categoryFound = false;
        {
            if (points < 0) {
                points = 0;
            }
            if (userStats.stats.length !== 0) {
                for (let i = 0; i < userStats.stats.length; i++) {
                    if (userStats.stats[i].category.name === name) {
                        userStats.stats[i].category.points += points;
                        categoryFound = true; 
                        break; 
                    }
                }
            }

            if (!categoryFound) {
                userStats.stats.push({category: {name: name, points: points}});
            }

            const totalCategory = userStats.stats.find(stat => stat.category.name === "total");
            if (totalCategory) {
                totalCategory.category.points += points;
            } else {
                userStats.stats.push({category: {name: "total", points: points}});
            }
        }
        await userStats.save();
        console.log(`app.patch  user:`, userStats);
        res.status(200).json({success: true, user: userStats});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Failed to update user'});
    }
})

app.get("/api/users/myStats", authenticateToken, async (req, res) => {
    const id = req.user.userId;
    console.log(id);
    try {
        const user = await User.findOne({_id: id});
        const games = await GameHistory.find({user: id});
        games.forEach(game => {
            if (!user.playedGames.includes(game._id)) {
                user.playedGames.push(game._id);
            }
        });

        const allQuestionIds = [];
        games.forEach(game => game.populate("questionsAndAnswers").then(res => game.save()));
        games.forEach(game => game.questionsAndAnswers.forEach(q => allQuestionIds.push(q)));
        console.log("allQuestionsIDs console log", allQuestionIds)

        const allQuestions = await Question.find({_id: {$in: allQuestionIds}})
        console.log(allQuestions)

        await user.save();


        let userStats = await Stats.findOne({userRef: id}).populate("userRef").then(userStats => res.status(200).json({
            success: true,
            user: userStats,
            games: games,
            allQuestions: allQuestions
        }));
        if (!userStats) {
            return res.status(404).json({success: false, error: 'User not found'});
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Failed to get user'});
    }
})


app.delete("/api/users/edit", authenticateToken, async (req, res) => {
    const id = req.user.userId;
    try {
        const result1 = await User.deleteOne({_id: id});
        const result2 = await Stats.deleteOne({userID: id});
        console.log(result1, result2);
        res.status(204).json({success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: 'Failed to delete user'});
    }
})

app.get("/api/users/stats", async (req, res) => {
    const statistics = await Stats.find().populate("userRef");
    return res.json(statistics);
})

app.get("/api/auth/logout", authenticateToken, (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, error: 'An error occurred during logout' });
    }

})

app.get("/api/auth/isLoggedIn", authenticateToken, (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'User is logged in' });
    } catch (err) {
        console.error('Error during authentication check:', err);
        res.status(500).json({ success: false, error: 'An error occurred while checking authentication' });
    }
});

app.get("/api/auth/getUserProfileData", authenticateToken, async (req,res) => {
    try{
       const id = req.user.userId;
       const user = await User.findOne({_id: id});
       const {hashedPassword, _id, createdAt, playedGames, ...userWithoutPassword} = user._doc;
       res.status(200).json({success: true, user: userWithoutPassword});
    } catch(err){
        console.error('Error while getting user profile data:', err);
        res.status(500).json({ success: false, error: 'An error occurred while getting user profile data' });
    }
    
});