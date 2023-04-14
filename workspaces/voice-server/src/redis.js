import { createClient } from 'redis';

export const getVoiceChatParticipants = async (chatId) => {
  const client = createClient({ url: "redis://localhost:6379" });
  await client.connect();
  const infoAsString = await client.get("voice-chat-" + chatId)
  await client.disconnect();
  if (infoAsString) return JSON.parse(infoAsString)
  else return { chatId: chatId, particpants: [] }
}