<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini AI 对话</title>
    <!-- 引入Google Fonts以获得杂志风格字体 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Noto+Sans+SC:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --font-sans: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            --color-bg: #ffffff;
            --color-text: #222222;
            --color-light-gray: #f5f5f5;
            --color-mid-gray: #dddddd;
            --color-dark-gray: #888888;
        }
        body {
            font-family: var(--font-sans);
            background-color: var(--color-light-gray);
            color: var(--color-text);
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .container {
            width: 100%;
            max-width: 800px;
            background-color: var(--color-bg);
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        header {
            text-align: center;
            margin-bottom: 30px;
        }
        h1 {
            font-family: var(--font-sans);
            font-size: 2.5em;
            margin: 0 0 10px 0;
            color: #333;
        }
        .intro {
            font-size: 1.0em;
            color: #666;
            max-width: 600px;
            margin: 0 auto 20px auto;
            line-height: 1.5;
        }
        .section {
            margin-bottom: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--color-mid-gray);
        }
        .section h2 {
            font-family: var(--font-sans);
            font-weight: 500;
            font-size: 1.1em;
            margin: 0 0 15px 0;
            color: var(--color-text);
        }
        .textarea {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid var(--color-mid-gray);
            border-radius: 4px;
            font-family: var(--font-sans);
            font-size: 0.95em;
            resize: vertical;
            min-height: 80px;
        }
        .btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 1em;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .response-area {
            border: 1px solid var(--color-mid-gray);
            border-radius: 4px;
            padding: 15px;
            background-color: #fdfdfd;
            min-height: 120px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 0.95em;
            line-height: 1.6;
        }
    
</head>
<body>

    <div class="container">
        <header>
            <h1>Gemini AI 对话</h1>
            <p class="intro">与 Gemini AI 进行智能对话。</p>
        </header>

        <div class="section">
            <h2>1. 输入您的消息</h2>
            <textarea id="messageInput" class="textarea" placeholder="在此输入您的消息..." rows="5"></textarea>
            <button id="sendMessageBtn" class="btn">发送</button>
        </div>

        <div class="section">
            <h2>2. Gemini 的回复</h2>
            <div id="responseArea" class="response-area">
                <p>等待您的消息...</p>
            </div>
        </div>
    </div>

    <script>
        const messageInput = document.getElementById('messageInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const responseArea = document.getElementById('responseArea');

        sendMessageBtn.addEventListener('click', async () => {
            const message = messageInput.value.trim();
            if (message) {
                responseArea.innerHTML = '<p>正在发送消息...</p>';
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        responseArea.innerHTML = `<p>${data.reply}</p>`;
                    } else {
                        responseArea.innerHTML = `<p style="color: red;">错误: ${data.error}</p>`;
                    }
                } catch (error) {
                    responseArea.innerHTML = `<p style="color: red;">请求失败: ${error.message}</p>`;
                }
            } else {
                responseArea.innerHTML = '<p style="color: orange;">请输入您的消息。</p>';
            }
        });
    </script>
</body>
</html>
