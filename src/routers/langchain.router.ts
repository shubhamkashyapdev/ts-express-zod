import { chatgptPrompt, chatgptPromptChat } from '@controllers/langchain';
import { Router } from 'express';

const router = Router();

router.post('/chatgpt', chatgptPrompt);
router.post('/chatgpt/chat', chatgptPromptChat);

export default router;
