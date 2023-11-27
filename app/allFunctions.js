const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function main(question) {
  const myAssistantId = "asst_T53lLMVSICP4OFfpCPEzQVir";
  let thread_id, run_id;

  // Create a Thread
  const myThread = await openai.beta.threads.create();
  // console.log("Thread created with ID: ", myThread.id, "\n");

  while (true) {
    if (question.toLowerCase() === "Bye") {
      // console.log("Exiting chat...");
      break;
    }

    // Add a Message to a Thread
    const myThreadMessage = await openai.beta.threads.messages.create(
      (thread_id = myThread.id),
      {
        role: "user",
        content: question,
      }
    );

    // Run the Assistant
    const myRun = await openai.beta.threads.runs.create(
      (thread_id = myThread.id),
      {
        assistant_id: myAssistantId,
      }
    );

    // Wait for the Run to complete
    let keepRetrievingRun;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before checking the status
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(
        (thread_id = myThread.id),
        (run_id = myRun.id)
      );
    } while (keepRetrievingRun.status !== "completed");

    // Retrieve the Messages added by the Assistant to the Thread
    const allMessages = await openai.beta.threads.messages.list(
      (thread_id = myThread.id)
    );

    const assistantMessage = allMessages.data.find(
      (m) => m.role === "assistant"
    );
    if (assistantMessage) {
      return assistantMessage.content[0].text.value;
    } else {
      alert("Assistant did not respond.");
    }
  }
}
