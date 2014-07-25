###Challenge

#### See me running
Run in terminal: ```node server.js``` (server is needed for async loading of the json).

Then open in your browser: ```127.0.0.1:5000```.

The tests are at: ```http://127.0.0.1:5000/test/test.html```.

#### Description

Create a word cloud that displays the topics in the `apps\assets\topics.json` file in this Gist.

- The label.property of each topic should be the 'word' in the word cloud
- Each topic should have one of 6 different text sizes, with the most popular topics largest, and least popular smallest
- A topic with a sentiment score > 60 should be displayed in green
- A topic with a sentiment score < 40 should be displayed in red
- Other topics should be displayed in grey
- When a topic is clicked, metadata about the topic should be displayed (total volume, and how that breaks down into positive, neutral and negative sentiment)
