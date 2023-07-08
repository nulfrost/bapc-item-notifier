import {
  type Handler,
  type HandlerEvent,
  type HandlerContext,
  schedule,
} from "@netlify/functions";

const headphoneString = "Sony WF-1000XM4";

const myHandler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const response = await fetch(
    "https://www.reddit.com/r/bapcsalescanada/.json"
  );
  const salePosts = await response.json();

  const sonyHeadphonesPost = salePosts.data.children.find((post) =>
    post.data.title.includes(headphoneString)
  );

  console.log(sonyHeadphonesPost);

  const { WEBHOOK_ID, WEBHOOK_TOKEN } = process.env;

  if (sonyHeadphonesPost) {
    await fetch(
      `https://discord.com/api/v10/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}`,
      {
        method: "POST",
        body: JSON.stringify({
          embeds: [
            {
              title: sonyHeadphonesPost.data.title,
              author: sonyHeadphonesPost.data.subreddit_name_prefixed,
              color: 5814783,
              url: `https://reddit.com/${sonyHeadphonesPost.data.permalink}`,
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
    };
  }

  return {
    statusCode: 200,
  };
};

const handler = schedule("0 */12 * * *", myHandler);

export { handler };
