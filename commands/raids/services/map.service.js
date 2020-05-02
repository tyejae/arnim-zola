const Canvas = require('canvas');
const Discord = require('discord.js');
const Request = require('request');

const RAID_NAMES = require('../json/raid-json/raids.json');
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class MapService {

    static async handleMessage(raid, raidId, teamGuid, message) {
        const rows = raid.RaidDetails.rows;
        const cols = raid.RaidDetails.columns;
        const canvas = Canvas.createCanvas(65 * rows, 65 * cols + 220);
        const ctx = canvas.getContext('2d');
        const bg = await Canvas.loadImage(`./commands/admin/character_images/background.jpg`);
        
        ctx.drawImage(bg, 0, 0, rows * 65, cols * 65 + 220);
        
        const userGuid = '5a6379b8ec3b1';
        const strikeTeam = '1';
        Request(`https://run.tyejae.com/services/getAllianceMapInfo?userGuid=${userGuid}&teamGuid=${teamGuid}&raidId=${raidId}&strikeTeam=${strikeTeam}`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                const result = JSON.parse(response.body);
                const mapLines = {};
                result.message.mapLines.forEach(line => {
                    const key = line.elementId.replace(/-added/g, "");
                    if (!mapLines[key]) {
                        mapLines[key] = []
                    }
                    mapLines[key].push(line);
                });

                const mapLaneColors = {};
                if (result.message.laneAssignmentColors) {
                    result.message.laneAssignmentColors.forEach(lane => {
                        mapLaneColors[lane.lane] = lane;
                    })
                }

                this.drawMap(raid, raidId, rows, cols, canvas, ctx, message, mapLines, mapLaneColors);
            } else {
                console.log(error)
            }
        });
    }

    static async drawMap(raid, raidId, rows, cols, canvas, ctx, message, mapLines, mapLaneColors) {
        const psylocke = await Canvas.loadImage(`./commands/admin/character_images/Psylocke.png`);
        const empty = await Canvas.loadImage(`./commands/raids/images/RaidStartNode.png`);
        const bossFrame = await Canvas.loadImage(`./commands/raids/images/raid-frame-boss-villain.png`);
        const frame = await Canvas.loadImage(`./commands/raids/images/raid-frame-villain.png`);
        const raidSprites = await Canvas.loadImage(`./commands/raids/images/raid-sprites.png`);
        const hydraLogo = await Canvas.loadImage(`./commands/raids/images/hydra-logo-rotated.png`);
        const broom = await Canvas.loadImage(`./commands/raids/images/broom.svg`);

        let raidName = "";
        RAID_NAMES.RaidList.forEach(r => {
            if (r.raidId === raidId) {
                raidName = r.name;
            }
        })

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const letter = ALPHABET[r];
                const room = raid.RaidDetails.rooms[`${letter}${c + 1}`];
                if (room) {
                    const dx = (65 * (r + 1)) - 65;
                    const dy = (65 * cols) - (65 * (c + 1)) + 20;

                    ctx.lineWidth = 6;
                    if (room.nextRooms[0]) {
                        if (mapLines[`${letter}${c + 1}to${letter}${c + 2}`]) {
                            mapLines[`${letter}${c + 1}to${letter}${c + 2}`].forEach(line => {
                                ctx.beginPath();
                                ctx.strokeStyle = line.backgroundColor;
                                const leftMargin = (line.leftMargin ? parseInt(line.leftMargin.replace(/px/g, "")) : 37) - 37;
                                ctx.moveTo(dx + 32 + leftMargin, dy + 32);
                                ctx.lineTo(dx + 32 + leftMargin, dy - 45);
                                ctx.stroke();
                                ctx.strokeStyle = "#3d3d3d";
                            })
                        } else {
                            ctx.beginPath();
                            ctx.strokeStyle = "#3d3d3d";
                            ctx.moveTo(dx + 32, dy + 32);
                            ctx.lineTo(dx + 32, dy - 45);
                            ctx.stroke();
                        }
                    }
                    if (room.nextRooms[1]) {
                        const nextLetter = r - 1 > 0 ? ALPHABET[r - 1] : undefined;
                        if (nextLetter && mapLines[`${letter}${c + 1}to${nextLetter}${c + 1}`]) {
                            mapLines[`${letter}${c + 1}to${nextLetter}${c + 1}`].forEach(line => {
                                ctx.beginPath();
                                ctx.strokeStyle = line.backgroundColor;
                                const topMargin = (line.topMargin ? parseInt(line.topMargin.replace(/px/g, "")) : 37) - 37;
                                ctx.moveTo(dx + 32, dy + 32 + topMargin);
                                ctx.lineTo(dx - 32, dy + 32 + topMargin);
                                ctx.stroke();
                                ctx.strokeStyle = "#3d3d3d";
                            })
                        } else {
                            ctx.beginPath();
                            ctx.strokeStyle = "#3d3d3d";
                            ctx.moveTo(dx + 32, dy + 32);
                            ctx.lineTo(dx - 32, dy + 32);
                            ctx.stroke();
                        }
                    }
                    if (room.nextRooms[2]) {
                        ctx.beginPath();
                        ctx.moveTo(dx + 32, dy + 32);
                        ctx.lineTo(dx + 92, dy + 32);
                        ctx.stroke();

                        const nextLetter = r + 1 < ALPHABET.length ? ALPHABET[r + 1] : undefined;
                        if (nextLetter && mapLines[`${letter}${c + 1}to${nextLetter}${c + 1}`]) {
                            mapLines[`${letter}${c + 1}to${nextLetter}${c + 1}`].forEach(line => {
                                ctx.beginPath();
                                ctx.strokeStyle = line.backgroundColor;
                                const topMargin = (line.topMargin ? parseInt(line.topMargin.replace(/px/g, "")) : 37) - 37;
                                ctx.moveTo(dx + 32, dy + 32 + topMargin);
                                ctx.lineTo(dx + 92, dy + 32 + topMargin);
                                ctx.stroke();
                                ctx.strokeStyle = "#3d3d3d";
                            })
                        } else {
                            ctx.beginPath();
                            ctx.strokeStyle = "#3d3d3d";
                            ctx.moveTo(dx + 32, dy + 32);
                            ctx.lineTo(dx + 92, dy + 32);
                            ctx.stroke();
                        }
                    }
                }
            }
        }
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const room = raid.RaidDetails.rooms[`${ALPHABET[r]}${c + 1}`];
                if (room) {
                    const dx = (65 * (r + 1)) - 65;
                    const dy = (65 * cols) - (65 * (c + 1)) + 20;

                    if (room.name === "") {
                        ctx.drawImage(empty, dx, dy, 65, 65);
                    } else if (room.missions["1"] && room.missions["1"].icon.startsWith('Portrait')) {
                        ctx.drawImage(bossFrame, dx + 6, dy, 51, 55);
                        ctx.drawImage(psylocke, dx + 16, dy - 6, 30, 48);
                    } else {
                        ctx.drawImage(frame, dx + 13, dy + 8, 37, 42);
                        ctx.drawImage(raidSprites, 96, 0, 32, 32, dx + 16, dy + 12, 32, 32)
                    }
                }
            }
        }

        // Put the raid name on the map
        ctx.font = `bold 40px Sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(raidName, canvas.width / 2, canvas.height - 170);
        
        // Underline the text
        const textWidth = ctx.measureText(raidName).width;
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo((canvas.width - textWidth) / 2, canvas.height - 155);
        ctx.lineTo(((canvas.width - textWidth) / 2) + textWidth, canvas.height - 155);
        ctx.stroke();

        for (let i = 0; i < 8; i++) {
            const mapLane = mapLaneColors[`${i + 1}`];
            ctx.beginPath();
            ctx.arc(((canvas.width - 525) / 2) + (i * 75), canvas.height - 110, 25, 0, 2 * Math.PI);
            ctx.fillStyle = mapLane ? mapLane.color : "#303030";
            ctx.fill();

            ctx.font = `bold 30px Sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(`${i + 1}`, ((canvas.width - 525) / 2) + (i * 75), canvas.height - 40);

            if (!mapLane) {
                ctx.font = `bold 30px Sans-serif`;
                ctx.textAlign = "center";
                ctx.fillStyle = "#303030";
                ctx.drawImage(broom, ((canvas.width - 525) / 2) + (i * 75) - 20, canvas.height - 130, 40, 40);
            }
        }

        // Put the HYDRA logo
        ctx.drawImage(hydraLogo, 10, canvas.height - (517 * 0.37) - 20, (113 * 0.37), (517 * 0.37));

        // Attach the image and send
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'alpha-image.png');
        message.channel.send(``, attachment);
    }
}
module.exports = MapService;