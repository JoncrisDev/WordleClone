const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3001 
const axios = require("axios").default;
const express = require("express")
const cors = require("cors");
const { ppid } = require("process");


const app = express()
app.use(cors())
app.use(express.static('public'))

// route for checking that a word is valid.
app.get('/check', (req, res) => {
    console.log("The request being passed is: ", req.query.word)
    const word = req.query.word

    const options = {
        method: 'GET',
        url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
        params: {entry: word},
        headers: {
            'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.RapidAPIKey
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        res.json(response.data.result_msg)
    }).catch(function (error) {
        console.error(error);
    });
})

// get a random word of at least five letters
app.get('/word', (req, res) => {
    console.log("Getting a random word of five letters.")
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: {count: '1', wordLength: '5'},
        headers: {
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.RapidAPIKey 
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data)
        res.json(response.data)
    }).catch(function (error) {
        console.error(error);
    })
})

app.listen(PORT, () => console.log("Server running on port: " + PORT))