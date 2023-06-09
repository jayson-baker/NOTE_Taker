require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.delete("/api/notes/:id", (req, res) => {
  const idToDelete = req.params.id;
  const currentNotes = JSON.parse(
    fs.readFileSync("./db/db.json", { encoding: "utf8" })
  );
  let index = currentNotes.findIndex((el) => el.id === idToDelete);
  currentNotes.splice(index, 1);
  fs.writeFile(`./db/db.json`, JSON.stringify(currentNotes), (err) =>
    err ? console.error(err) : console.log(`A note has been DELETED`)
  );
  res.sendStatus(200);
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received`);
  const { title, text } = req.body;

  if (title && text) {
    const combineNotes = JSON.parse(
      fs.readFileSync("./db/db.json", { encoding: "utf8" })
    );
    const newNote = {
      id: uniqid(),
      title,
      text,
    };

    combineNotes.push(newNote);

    fs.writeFile(`./db/db.json`, JSON.stringify(combineNotes), (err) =>
      err
        ? console.error(err)
        : console.log(`A new note has been written to JSON file`)
    );

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 App listening at PORT: ${PORT}`);
});
