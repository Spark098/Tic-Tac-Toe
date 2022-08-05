
# Tic Tac Toe

It is a multiplayer real time tic tac toe game. 
Players can create rooms or join existing ones to play with each other.
Any two player can play online by entering the room ID.



## Installation

Install it with npm

```bash
  npm install
```
    
## How to run

To run the project type

```bash
  node server.js
```
or 
```bash
  nodemon server.js
```
and then open http://localhost:3000/ in a new tab.



## How to use it

📌 Users have to create a room by entering a room ID and ask the other person to join the room by entering the same room ID.

📌 After two players have joined no other person can enter the same room.

📌 If any player leaves in the middle of the game, the game is stopped can not be resumed and the room(room ID) expires at the same time.
Now any other player can use the same room(room ID).

📌 After the game ends either in win,lose or tie, the room ID expires and now the room becomes free to be used by any other person.

## Note

The project is unresponsive and suitable to be run on desktop and laptop.

