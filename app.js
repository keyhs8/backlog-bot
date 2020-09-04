const { App } = require('@slack/bolt');
const fetch = require('node-fetch');
const bProj = `${process.env.BACKLOG_PROJECT}-`;

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain Backlog project id "XXXX-"
app.message(bProj, async ({ message, say }) => {
    var re = new RegExp(bProj+'[0-9]{1,}', 'g'); 
    const keys = message.text.match(re);
    for (const issueKey of keys) {
        const response = await fetch(
            `https://${process.env.BACKLOG_WORK_SPACE}/api/v2/issues/${issueKey}?apiKey=${process.env.BACKLOG_API_KEY}`
        );
        if (response.status !== 200) {
            return;
        }
        const b = await response.json();
        if (!b) {
            return;
        }
        // console.log(b);
        await say(
            // `[${b.issueType.name}] ` +
            // `<https://${process.env.BACKLOG_WORK_SPACE}/view/${issueKey}|${issueKey} ${b.summary}> ` +
            // `| ${b.assignee.name} | ${b.priority.name} | ${b.milestone[0]?.name} | ${b.status.name}`
            `<https://${process.env.BACKLOG_WORK_SPACE}/view/${issueKey}|${issueKey}>`
        );
    }
});

(async () => {
  // Start your app
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();