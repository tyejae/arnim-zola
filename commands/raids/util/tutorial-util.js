class TutorialUtil {
    static getTutorial(message, raid) {
        let value = `:black_small_square: Type \`!${raid.alias}\` to view the Open Lanes for each raid.
        :black_small_square: If you wanted to claim ${raid.name} 1-8, you would type \`!${raid.alias} 1 8\`.
        :black_small_square: If you would like to see who has claimed the other lanes, you can type \`!${raid.alias} lanes\``;
        const embed = {
            "author": {
                "name": `Invalid Command (${message.content})`
            },
            "title": '*How To Use*',
            "color": 0
        };
        embed.description = value
        return embed;
    }
}
module.exports = TutorialUtil;