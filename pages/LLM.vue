// pages/LLM.vue
<template>
  <el-container class="llm-container">
    <el-main>
      <div class="conversation-list">
        <el-card v-for="(conversation, index) in conversations" :key="index" class="conversation-card">
          <div class="user-message">
            <div class="message-header">
              <div class="message-name">
                <strong>用户:</strong>
              </div>
              <img src="~/assets/perry.png" alt="User Avatar" class="avatar" />
            </div>
            <div class="message-content">
              {{ conversation.question }}
            </div>
          </div>
          <div class="ai-message">
            <div class="message-header">
              <img src="~/assets/ai.png" alt="AI Avatar" class="avatar" />
              <div class="message-name">
                <strong>DeepSeek AI:</strong>
              </div>
            </div>
            <div class="message-content">
              {{ conversation.response }}
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
    <el-footer class="footer">
      <el-form :model="form" inline>
        <el-form-item label="API Key">
          <el-input v-model="form.apikey" placeholder="请输入 API Key"></el-input>
        </el-form-item>
        <el-form-item label="用户输入">
          <el-input v-model="form.userInput" placeholder="请输入问题" @keyup.enter.native="callModel"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="callModel">提问</el-button>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        apikey: '',
        userInput: '',
      },
      conversations: [],
    }
  },
  methods: {
    async callModel() {
      if (!this.form.userInput) {
        this.$message.warning('请输入问题')
        return
      }

      try {
        // 构造请求的 body
        const requestBody = {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: this.form.userInput,
            },
          ],
          stream: false,
        }

        // 使用 this.$axios 调用后端 API，并设置请求头
        const response = await this.$axios.post('https://api.deepseek.com/chat/completions', requestBody, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.form.apikey}`, // 替换为你的访问令牌
          },
        })

        // 处理后端返回的响应数据
        const responseData = response.data.choices ? response.data.choices[0].message.content : response.data
        this.conversations.push({
          question: this.form.userInput,
          response: responseData,
        })
        this.form.userInput = ''
      } catch (error) {
        console.error(error)
        this.$message.error('出错啦！')
      }
    },
  },
}
</script>

<style scoped>
.llm-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.conversation-list {
  margin-bottom: 20px;
}

.conversation-card {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.user-message {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ai-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-header {
  display: flex;
  align-items: center;
}

.user-message .message-header {
  justify-content: flex-end;
}

.ai-message .message-header {
  justify-content: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px; /* For user message */
  margin-left: 10px; /* For AI message */
}

.message-name {
  margin-right: 10px; /* For user message */
  margin-left: 10px; /* For AI message */
}

.user-message .message-content {
  text-align: right;
  margin-top: 5px;
}

.ai-message .message-content {
  text-align: left;
  margin-top: 5px;
}

.footer {
  padding: 10px;
  background-color: #f9fafc;
  border-top: 1px solid #ebeef5;
}

.el-form-item {
  margin-bottom: 10px;
}

.el-form-item__label {
  width: 100px;
}

.el-form-item__content {
  margin-left: 100px;
}

.question {
  margin-bottom: 10px;
}

.response {
  color: #606266;
}
</style>
