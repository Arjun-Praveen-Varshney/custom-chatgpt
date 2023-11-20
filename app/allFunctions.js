const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

export default async function main(question) {
  // Step 1: Create an Assistant
  //Already Created
  const myAssistantId = "asst_T53lLMVSICP4OFfpCPEzQVir";
  // const question = "";
  let thread_id, run_id;

  // Step 2: Create a Thread
  const myThread = await openai.beta.threads.create();
  // console.log("This is the thread object: ", myThread, "\n");

  // Step 3: Add a Message to a Thread
  const myThreadMessage = await openai.beta.threads.messages.create(
    (thread_id = myThread.id),
    {
      role: "user",
      content: question,
    }
  );
  // console.log("This is the message object: ", myThreadMessage, "\n");

  // Step 4: Run the Assistant
  const myRun = await openai.beta.threads.runs.create(
    (thread_id = myThread.id),
    {
      assistant_id: myAssistantId,
    }
  );
  // console.log("This is the run object: ", myRun, "\n");

  // Step 5: Periodically retrieve the Run to check on its status to see if it has moved to completed
  const retrieveRun = async () => {
    let keepRetrievingRun;

    while (myRun.status !== "completed") {
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(
        (thread_id = myThread.id),
        (run_id = myRun.id)
      );

      // console.log(`Run status: ${keepRetrievingRun.status}`);

      if (keepRetrievingRun.status === "completed") {
        // console.log("\n");
        break;
      }
    }
  };
  retrieveRun();

  // Step 6: Retrieve the Messages added by the Assistant to the Thread
  const waitForAssistantMessage = async () => {
    await retrieveRun();

    const allMessages = await openai.beta.threads.messages.list(
      (thread_id = myThread.id)
    );

    // console.log(
    //   "------------------------------------------------------------ \n"
    // );

    // console.log("User: ", myThreadMessage.content[0].text.value);
    // console.log("Assistant: ", allMessages.data[0].content[0].text.value);
    return allMessages.data[0].content[0].text.value;
  };
  const reply = waitForAssistantMessage();
  return reply;
}

// main();
