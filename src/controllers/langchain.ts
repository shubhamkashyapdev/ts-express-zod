import { OpenAI } from 'langchain/llms/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanChatMessage } from 'langchain/schema';
import { Request, Response } from 'express';
import { resGeneric } from '@utils/utils';
import { handleError } from '@utils/error';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

const model = new OpenAI({
  temperature: 0.9,
});
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });
const chat = new ChatOpenAI({ temperature: 0 });
export const chatgptPrompt = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt as string;
    if (!prompt || prompt.length < 3 || prompt.length > 1000) {
      const response = resGeneric({
        status_code: 400,
        message: 'Please provide a valid prompt',
      });
      res.status(400).json(response);
    }
    const modelRes = await chain.call({ input: prompt });
    const response = resGeneric({
      status_code: 200,
      data: modelRes,
      message: 'Prompt was successfully',
    });
    res.status(200).json(response);
  } catch (err) {
    handleError({ res, err });
  }
};

export const chatgptPromptChat = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt as string;
    if (!prompt || prompt.length < 3 || prompt.length > 1000) {
      const response = resGeneric({
        status_code: 400,
        message: 'Please provide a valid prompt',
      });
      return res.status(400).json(response);
    }
    const chatPrompt = new HumanChatMessage(prompt);
    const modelRes = await chat.call([chatPrompt]);
    const response = resGeneric({
      status_code: 200,
      data: modelRes,
      message: 'Chat Prompt was successfully',
    });
    res.status(200).json(response);
  } catch (err) {
    handleError({ res, err });
  }
};
