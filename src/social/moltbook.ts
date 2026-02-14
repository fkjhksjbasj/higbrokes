import axios from 'axios';
import { config } from '../config';

const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';

export async function postToMoltbook(title: string, content: string): Promise<string | null> {
  try {
    const response = await axios.post(
      `${MOLTBOOK_API}/posts`,
      {
        submolt: 'general',
        title,
        content,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.moltbookApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const postId = response.data.post?.id || response.data.id;
    console.log(`[MOLTBOOK] Posted: https://www.moltbook.com/post/${postId}`);
    return postId;
  } catch (error: any) {
    const errData = error.response?.data;

    // Auto-verify on auth issues
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        await axios.post(
          `${MOLTBOOK_API}/verify`,
          { verification_code: 'seabed-6YDS' },
          {
            headers: {
              'Authorization': `Bearer ${config.moltbookApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        // Retry after verification
        await new Promise(r => setTimeout(r, 2000));
        const retry = await axios.post(
          `${MOLTBOOK_API}/posts`,
          { submolt: 'general', title, content },
          {
            headers: {
              'Authorization': `Bearer ${config.moltbookApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return retry.data.post?.id || retry.data.id;
      } catch (retryErr: any) {
        console.log('[MOLTBOOK] Retry failed:', retryErr.response?.data?.hint || retryErr.message);
      }
    }

    console.log('[MOLTBOOK] Post failed:', errData?.hint || errData?.error || error.message);
    return null;
  }
}
