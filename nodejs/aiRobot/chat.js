const express = require('express');
const OpenAI = require('openai');
const axios = require('axios');
const { Pinecone } = require('@pinecone-database/pinecone');

const router = express.Router();

// 這裡就直接用 process.env
const openai  = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index    = pinecone.index(process.env.PINECONE_INDEX_NAME);

// 定義 GPT 可以呼叫的 function
const functions = [
  {
    name: 'search_products',
    description: '根據關鍵字搜尋商品',
    parameters: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: '要搜尋的關鍵字'
        }
      },
      required: ['keyword']
    }
  }
];

async function searchProducts(keyword) {
  let result = await axios.post('http://localhost:8000/post/productsreach/second', { 'keyword': keyword })
  if (result.data.length !== 0) {
    res_json = {
      url: `http://localhost:3000/product/detail/${result.data[0].id}`,
      pd_name:result.data[0].name
    }
    return res_json
  }
  else {
    return'查無商品'
  }

}

async function embed(text) {
  const resp = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return resp.data[0].embedding;
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const userVec = await embed(message);
    const queryRes = await index.query({
      vector: userVec,
      topK: 3,
      includeMetadata: true
    });
    const contexts = queryRes.matches
      .map(m => `Q: ${m.metadata.question}\nA: ${m.metadata.answer}`)
      .join('\n----\n');
    const messages = [
      { role: 'system', content: `你是一位寵物用品購物網站【好拾毛】的客服助理。以下是知識庫範例：\n${contexts}` },
      { role: 'user',   content: message }
    ];
    const chatResp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      functions,
      function_call: 'auto',  // 讓模型自動決定要不要 call
      temperature: 0.2,
      max_tokens: 512
    });
    let answer=chatResp.choices[0].message
    if (answer.function_call) {
      const { name, arguments: argsJson } = answer.function_call;
      const args = JSON.parse(argsJson);
      
      let resultData;
      if (name === 'search_products') {
        // 執行你自己的搜尋邏輯
        resultData = await searchProducts(args.keyword);
      } else {
        resultData = { error: `Unknown function ${name}` };
      }
      return res.json({ answer: resultData });

    }
    else {
          res.json({ answer: answer.content });

    }
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
