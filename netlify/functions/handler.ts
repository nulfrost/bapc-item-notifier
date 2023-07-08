import {
  type Handler,
  type HandlerEvent,
  type HandlerContext,
  schedule,
} from "@netlify/functions";

const headphoneString = "Sony WH-1000XM4";

const myHandler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const response = await fetch(
    "https://www.reddit.com/r/bapcsalescanada/.json"
  );
  try {
    const salePosts = await response.json();

    const sonyHeadphonesPost = salePosts.data.children.find((post) =>
      post.data.title.includes(headphoneString)
    );

    const { WEBHOOK_ID, WEBHOOK_TOKEN } = process.env;

    if (sonyHeadphonesPost) {
      await fetch(
        `https://discord.com/api/v10/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}`,
        {
          method: "POST",
          body: JSON.stringify({
            content: "<@217397769759883265>",
            embeds: [
              {
                title: sonyHeadphonesPost.data.title,
                color: 5814783,
                url: `https://reddit.com/${sonyHeadphonesPost.data.permalink}`,
                author: {
                  name: sonyHeadphonesPost.data.subreddit_name_prefixed,
                },
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }

  return {
    statusCode: 200,
  };
};

const handler = schedule("0 * * * *", myHandler);

export { handler };
