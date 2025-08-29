import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const API_KEY = "AIzaSyDrmBiHqcc120_KX2Rqi9xL36whZfdQ3Xw";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  console.log("[" + new Date().toISOString() + "] " + request.method + " " + url.pathname);
  
  // 处理静态文件
  if (url.pathname === "/") {
    console.log("[LOG] 返回主页HTML");
    return new Response(HTML_CONTENT, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
  
  // 处理API请求
  if (url.pathname === "/api/chat" && request.method === "POST") {
    try {
      const body = await request.json();
      const userMessage = body.message;
      
      console.log("[LOG] 收到聊天请求，用户消息: \"" + userMessage + "\"");
      
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
      
      console.log("[LOG] Gemini API响应状态: " + response.status);
      
      const data = await response.json();
      console.log("[LOG] Gemini API返回数据: " + JSON.stringify(data));
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const geminiResponse = data.candidates[0].content.parts[0].text;
        console.log("[LOG] Gemini回复: \"" + geminiResponse.substring(0, 100) + "...\"");
        return new Response(JSON.stringify({ response: geminiResponse }), {
          headers: { "content-type": "application/json" },
        });
      } else {
        console.error("[ERROR] Gemini API返回格式异常: " + JSON.stringify(data));
        return new Response(JSON.stringify({ error: "API返回格式错误" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    } catch (error) {
      console.error("[ERROR] API调用失败: " + error);
      return new Response(JSON.stringify({ error: "请求失败: " + error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }
  
  console.log("[LOG] 未找到路由: " + url.pathname);
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
            <button class="send-button" id="sendButton" onclick="window.sendMessage()">发送</button>
        </div>
    </div>

    <script>
        (function() {
            // 将函数挂载到全局作用域
            window.sendMessage = async function() {
                console.log("=== 开始发送消息 ===");
                
                var inputBox = document.getElementById('inputBox');
                var sendButton = document.getElementById('sendButton');
                var displayArea = document.getElementById('displayArea');
                
                var message = inputBox.value.trim();
                console.log("获取输入内容: " + message);
                
                if (!message) {
                    console.log("消息为空，取消发送");
                    return;
                }
                
                console.log("禁用输入框和按钮");
                inputBox.disabled = true;
                sendButton.disabled = true;
                
                console.log("更新显示区域");
                displayArea.innerHTML = 
                    '<strong>您:</strong> ' + message + '<br><br>' +
                    '<div style="color: #666; font-style: italic;">正在等待Gemini回复...</div>';
                
                try {
                    console.log("准备发送请求到 /api/chat");
                    var response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: message }),
                    });
                    
                    console.log("收到响应，状态码: " + response.status);
                    var data = await response.json();
                    console.log("收到JSON数据");
                    
                    if (data.response) {
                        console.log("成功获取Gemini回复");
                        displayArea.innerHTML = 
                            '<strong>您:</strong> ' + message + '<br><br>' +
                            '<strong>Gemini:</strong> ' + data.response;
                    } else {
                        console.log("收到错误响应");
                        displayArea.innerHTML = 
                            '<strong>您:</strong> ' + message + '<br><br>' +
                            '<div style="color: #dc3545;">错误: ' + (data.error || '未知错误') + '</div>';
                    }
                } catch (error) {
                    console.log("发生错误: " + error.message);
                    displayArea.innerHTML = 
                        '<strong>您:</strong> ' + message + '<br><br>' +
                        '<div style="color: #dc3545;">错误: 网络请求失败</div>';
                }
                
                console.log("重置输入框和按钮");
                inputBox.value = '';
                inputBox.disabled = false;
                sendButton.disabled = false;
                inputBox.focus();
                console.log("=== 发送完成 ===");
            };
            
            // 回车键支持
            document.getElementById('inputBox').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    window.sendMessage();
                }
            });
            
            // 页面加载完成
            document.addEventListener('DOMContentLoaded', function() {
                console.log("页面加载完成，所有元素已就绪");
            });
        })();
    </script>
</body>
</html>
`;

console.log("服务器启动在 http://localhost:8000");
serve(handleRequest, { port: 8000 });
