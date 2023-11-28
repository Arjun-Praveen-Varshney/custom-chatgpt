const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const myAssistantId = "asst_T53lLMVSICP4OFfpCPEzQVir";
let thread_id, run_id;

async function thread() {
  // Create a Thread
  const myThread = await openai.beta.threads.create();
  // console.log("Thread created with ID: ", myThread.id, "\n");
  return myThread;
}

async function main(thread_id, question) {
  while (true) {
    if (question.toLowerCase() === "Bye") {
      // console.log("Exiting chat...");
      break;
    }

    // Add a Message to a Thread
    const myThreadMessage = await openai.beta.threads.messages.create(
      (thread_id = thread_id),
      {
        role: "user",
        content: question,
      }
    );

    // Run the Assistant
    const myRun = await openai.beta.threads.runs.create(
      (thread_id = thread_id),
      {
        assistant_id: myAssistantId,
      }
    );

    // Wait for the Run to complete
    let keepRetrievingRun;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before checking the status
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(
        (thread_id = thread_id),
        (run_id = myRun.id)
      );
    } while (keepRetrievingRun.status !== "completed");

    // Retrieve the Messages added by the Assistant to the Thread
    const allMessages = await openai.beta.threads.messages.list(
      (thread_id = thread_id)
    );

    const assistantMessage = allMessages.data.find(
      (m) => m.role === "assistant"
    );
    if (assistantMessage) {
      return assistantMessage.content[0].text.value;
    } else {
      return "Assistant did not respond.";
    }
  }
}

export { main, thread };
