# Quiz Quest
Quiz Quest is a quiz game webapp with 4 game modes (Sprint, 50:50, Zen, All in), each of them gives a unique gameplay experience. The app uses the [Open Trivia Database API](https://opentdb.com/) for fetching the trivia questions. This project was created as a part of Codecool's Fullstack Developer course.

Short descriptions of the game modes:


Sprint - There are 10 questions, you only have 10 seconds to answer each of them, and you get XP based on your tempo.


Zen - There are 15 questions and they aren't timed, you can take all the time you need to answer.


50:50 - There are 10 true or false questions, you have 10 seconds to answer each.


All in - There are 10 questions and they are timed for 10 seconds, but the stakes are higher - good answer count double, while wrong answers count as minus XP.

The UI color theme is customizable with 8 color options. The XP system was created to give awards later on in the form of titles, this is still under development. There is a statistics page with the users game info, and a leaderboard between all the registered users.

# Created by
<a href="https://github.com/JeanetteMoKa">
  <img src="https://img.shields.io/badge/github-JeanetteMoKa-purple?logo=github" alt="Static Badge">
</a>
<a href="https://github.com/kveszti">
  <img src="https://img.shields.io/badge/github-kveszti-lightblue?logo=github" alt="Static Badge">
</a>  

# Table Of Contents
- [Used technologies](#used-technologies)  
- [Features](#features)  
- [Installation](#installation)   
- [Sneak peek](#sneak-peek) 
# Used technologies  

![Static Badge](https://img.shields.io/badge/NPM-blue?logo=npm) 
![Static Badge](https://img.shields.io/badge/Node.js-white?logo=node.js) 
![Static Badge](https://img.shields.io/badge/Express.js-purple?logo=express) 
![Static Badge](https://img.shields.io/badge/React-white?logo=react)
![Static Badge](https://img.shields.io/badge/Vite-yellow?logo=vite)
![Static Badge](https://img.shields.io/badge/MongoDB-green?logo=mongodb)


# Features  
Done features: 
- 4 game modes
- UI color themes
- Statistics page
- Leaderboard
- Game history with overview menu and detailed view to inspect all questions and answers
- Good answer streaks
- Profile settings

Planned features: 
- Real authentication (as the current login system was solely created to learn the frontend display issues)
- Expanding XP system with titles and achievements

# Installation   

1. Prerequisites and packages to install:
     - npm ^10.7.0
     - node.js ^22.2.0
     - vite  ^5.1.
     - dotenv ^16.4.2
     - express.js ^4.18.2
     - mongoose ^8.1.2
     - react ^18.2.0
     - react-dom ^18.2.0
     - react-router-dom ^6.25.1
     - nodemon ^3.0.3

3. Clone the repo.
4. Setup a .env file where you create a CONSTRING variable for your own mongoDB cluster you'd like to use for development.
5. From the root folder: ```cd client```
6. In the terminal: ```npm run dev```
7. From the root folder: ```cd server```
8. In the terminal: ```npm run dev```
     

# Sneak peek


![Képernyőfotó 2024-08-21 - 19 33 21](https://github.com/user-attachments/assets/675ff028-e631-4405-abaf-4fd74b111e1c)


![Képernyőfotó 2024-08-21 - 19 34 21](https://github.com/user-attachments/assets/c1d7a18f-a41e-4795-a064-68a9212ae455)


![Képernyőfotó 2024-08-21 - 19 34 59](https://github.com/user-attachments/assets/42ec9389-c8f4-4ae4-952b-90ce4f39a037)


![Képernyőfotó 2024-08-21 - 19 35 50](https://github.com/user-attachments/assets/fdc04705-816f-4f65-bd81-bc47c9406620)


![Képernyőfotó 2024-08-21 - 19 36 13](https://github.com/user-attachments/assets/185fdf53-ae7a-4ce9-b013-552f7faa17a6)

![Képernyőfotó 2024-08-21 - 19 35 32](https://github.com/user-attachments/assets/a4b73d29-4a66-4172-a9fa-69c352a19446)


![Képernyőfotó 2024-08-21 - 19 37 47](https://github.com/user-attachments/assets/c763a49b-6cf8-44bd-a383-10548412850f)


![Képernyőfotó 2024-08-21 - 19 35 15](https://github.com/user-attachments/assets/c0a40764-1fdd-4f54-b364-9b3fc3850887)


![Képernyőfotó 2024-08-21 - 19 36 26](https://github.com/user-attachments/assets/e4fe743d-0561-40cc-b232-6ac8a2f722c4)
