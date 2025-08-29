import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const API_KEY = "AIzaSyDrmBiHqcc120_KX2Rqi9xL36whZfdQ3Xw";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // 处理静态文件
  if (url.pathname === "/") {
    return new Response(HTML_CONTENT, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
  
  // 处理API请求
  if (url.pathname === "/api/chat" && request.method === "POST") {
    try {
      const body = await request.json();
      const userMessage = body.message;
      
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userMessage
            }]
          }]
        }),
      });
      
      const data = await response.json();
      const geminiResponse = data.candidates[0].content.parts[0].text;
      
      return new Response(JSON.stringify({ response: geminiResponse }), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "请求失败" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }
  
  return new Response("Not Found", { status: 404 });
}

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini API 测试</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .display-area {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            min-height: 200px;
            margin-bottom: 20px;
            background-color: #fafafa;
            white-space: pre-wrap;
            overflow-y: auto;
        }
        .input-section {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .input-box {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        .send-button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .send-button:hover {
            background-color: #0056b3;
        }
        .send-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .loading {
            color: #666;
            font-style: italic;
        }
        .error {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Gemini API 测试</h1>
        
        <div class="display-area" id="displayArea">
            等待输入...
        </div>
        
        <div class="input-section">
            <input type="text" class="input-box" id="inputBox" placeholder="请输入您的问题..." />
            <button class="send-button" id="sendButton" onclick="sendMessage()">发送</button>
        </div>
    </div>

    <script>
        async function sendMessage() {
            const inputBox = document.getElementById('inputBox');
            const sendButton = document.getElementById('sendButton');
            const displayArea = document.getElementById('displayArea');
            
            const message = inputBox.value.trim();
            if (!message) return;
            
            // 禁用输入和按钮
            inputBox.disabled = true;
            sendButton.disabled = true;
            
            // 显示用户消息
            displayArea.innerHTML = 
                '<strong>您:</strong> ' + message + '\n\n' +
                '<div class="loading">正在等待Gemini回复...</div>';
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }),
                });
                
                const data = await response.json();
                
                if (data.response) {
                    displayArea.innerHTML = 
                        '<strong>您:</strong> ' + message + '\n\n' +
                        '<strong>Gemini:</strong> ' + data.response;
                } else {
                    displayArea.innerHTML = 
                        '<strong>您:</strong> ' + message + '\n\n' +
                        '<div class="error">错误: ' + (data.error || '未知错误') + '</div>';
                }
            } catch (error) {
                displayArea.innerHTML = 
                    '<strong>您:</strong> ' + message + '\n\n' +
                    '<div class="error">错误: 网络请求失败</div>';
            }
            
            // 重置输入
            inputBox.value = '';
            inputBox.disabled = false;
            sendButton.disabled = false;
            inputBox.focus();
        }
        
        // 支持回车发送
        document.getElementById('inputBox').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
`;

console.log("服务器启动在 http://localhost:8000");
serve(handleRequest, { port: 8000 });
