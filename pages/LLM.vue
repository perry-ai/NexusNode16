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
                <strong>AI:</strong>
              </div>
            </div>
            <div class="message-content">
              {{ conversation.response }}
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
    <div class="workspace">
      <!-- <el-form :model="form"> -->
      <!-- <el-form-item inline> -->
      <el-input v-model="form.userInput" placeholder="请输入问题" @keyup.enter.native="callModel"></el-input>
      <div style="text-align: right;">
        <el-button type="text" @click="toggleApiKeyInput">
          <i class="el-icon-setting"></i>
        </el-button>
        <el-input v-show="showApiKey" v-model="form.apikey" placeholder="请输入 API Key" style="width: 200px;"></el-input>
        <el-button type="primary" @click="callModel" :loading="loading" style="justify-content: flex-end">提问</el-button>
        <!-- <div class="settings"> -->
        <!-- 添加设置图标按钮 -->

        <!-- 根据 showApiKey 控制 API Key 输入框的显示和隐藏 -->
      </div>

      <!-- </div> -->
      <!-- </el-form-item> -->
      <!-- </el-form> -->
    </div>
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
      loading: false,
      showApiKey: false, // 添加 showApiKey 状态
    }
  },
  methods: {
    async callModel() {
      if (this.loading) return;

      if (!this.form.userInput) {
        this.$message.warning('请输入问题')
        return
      }

      this.loading = true;

      try {
        const requestBody = {
          content: this.form.userInput,
        }
        const headersParams = {
          'Content-Type': 'application/json',
        }
        const response = await this.$axios.post('/transfer/deepseek', requestBody, {
          headers: headersParams,
        })

        const responseData = response?.data?.result || '出错啦！'
        this.conversations.push({
          question: this.form.userInput,
          response: responseData,
        })
        this.form.userInput = ''
      } catch (error) {
        console.error(error)
        this.$message.error('出错啦！')
      } finally {
        this.loading = false;
      }
    },
    toggleApiKeyInput() {
      this.showApiKey = !this.showApiKey; // 切换 showApiKey 的值
    }
  },
}
</script>

<style scoped>
.llm-container {
  height: 100%;
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
  margin-right: 10px;
  margin-left: 10px;
}

.message-name {
  margin-right: 10px;
  margin-left: 10px;
}

.user-message .message-content {
  text-align: right;
  margin-top: 5px;
}

.ai-message .message-content {
  text-align: left;
  margin-top: 5px;
}

.workspace {
  height: 100px;
  padding: 10px;
  background-color: #f9fafc;
  border-top: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
}

.settings {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
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