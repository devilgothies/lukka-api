const express = require("express"),
    cors = require("cors"),
    app = express();

app.use(cors());

require("dotenv").config()
const PORT = process.env.PORT || '80';

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const Discord = require("discord.js"),
    client = new Discord.Client();

const name = require("../package.json").name,
    version = require("../package.json").version,
    author = require("../package.json").author,
    url = require("../package.json").repository.url;

app.get("/", cors(corsOptions), (req, res) => {
    const mainpage = ({ name: `${name}`, version: `${version}`, author: `${author}`, repository_url: `${url}` })
    return res.send(mainpage)
});

app.get("/discord/user/:userID", cors(corsOptions), (req, res) => {
    client.users.fetch(req.params.userID).then((user) => {
        const results = ({ username: `${user.username}`, Bot: `${user.bot}`, discriminator: `${user.discriminator}`, url: `${user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })}` });
        return res.send(results);
    });
});

app.get("/discord/guild/:guildID", cors(corsOptions), (req, res) => {
    client.guilds.fetch(req.params.guildID)
        .then((guild) => {
        const results =
        ({ guildID: `${guild.id}`,
        guildname: `${guild.name}`,
        guildavatar: `${guild.iconURL({ size: 4096, dynamic: true })}`,
        guildrolesize: `${guild.roles.cache.size}`,
        guilduserssize: `${guild.members.cache.size}`,
        guildemojisize: `${guild.emojis.cache.size}`,
        guildmembers: `${guild.banner}`,
        guilddesc: `${guild.description}`,
        guildownerID: `${guild.ownerID}` });
        return res.send(results);
    });
});

app.use(function (req, res, next) {
    res.status(404).send("Wrong route, use this: [/discord/user/:userId]")
});

client.on("ready", () => {
    console.log(`${client.user.username} ready!.`)
});
app.listen(PORT, console.log(`listing to`, PORT));
client.login(process.env.TOKEN);
