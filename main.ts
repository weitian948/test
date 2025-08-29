import { GoogleGenerativeAI } from "npm:@google/generative-ai";

// 注意：在生产环境中，强烈建议将 API 密钥作为环境变量进行管理，而不是直接硬编码在代码中。
// 例如，在 Deno Deploy 项目设置中添加一个名为 GEMINI_API_KEY 的环境变量。
const GEMINI_API_KEY = "AIzaSyCQgiheAZ7m6Vxf6Q9HVs1iyfD4Y-G-f1U"; // 用户提供的 API 密钥

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 设置 CORS 头部，允许所有来源的请求，并支持 POST 请求。
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理 OPTIONS 请求 (CORS 预检请求)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (url.pathname === '/api/chat' && req.method === 'POST') {
    try {
      const { message } = await req.json();

      if (!message) {
        return new Response(JSON.stringify({ error: "Message is required" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(message);
      const response = result.response;
      const text = response.text();

      return new Response(JSON.stringify({ reply: text }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (error) {
      console.error("Error processing chat request:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  } else {
    // 对于其他所有请求，返回 index.html 内容
    const htmlContent = await Deno.readTextFile('./index.html');
    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...corsHeaders },
    });
  }
});
