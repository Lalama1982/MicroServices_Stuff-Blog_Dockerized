const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = []; // this save/hold all the events received and would allow "query" service to access

app.post("/events", async (req, res) => {
  console.log("[eventbus-index] :: Received Event: ", req.body.type);
  const event = req.body;
  /**
   * What ever is received as "req.body" is routed to all other listening apps
   */

  events.push(event); //this save/hold all the events received and would allow "query" service to access

  await axios.post("http://localhost:4000/events", event); // emitting to "posts" service
  await axios.post("http://localhost:4001/events", event); // emitting to "comments" service
  await axios.post("http://localhost:4002/events", event); // emitting to "query-service"
  await axios.post("http://localhost:4003/events", event); // emitting to "moderator"

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  // This will return event from its "safe" to requesting services (i.e "query")
  res.send(events);
});

app.listen(4005, () => {
  console.log("[event bus - index] ::  Listening on 4005");
});
