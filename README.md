# Connect 4 Game

*Author: Mariola Rubio*

### File structure

The client-side files are in the *front-end* folder. *conncet4.js* contains a game state object (which encompasses all information about the current state of the game, including turn, player names, where each player has placed a disc, etc.) and the functions to change this state: place discs, check for a win and calculate, fetch and send scores. *index.html* and *main.css* contain the website elements and styling of the game.

The server-side files are in the *back-end* folder. *index.js* defines the possible GET and POST requests: saves new scores received through POST and sends all time high scores (stored in a json file that persists server re-starts) to the client in response to a GET request.

### Dependencies

This project requires Express.js and Node.js.

### Running the Game

To run the game you must start the server by using "node index.js".
