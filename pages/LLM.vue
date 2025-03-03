// pages/LLM.vue
<template>
    <div>
        <input type="text" v-model="userInput" @keyup.enter="callModel">
        <input type="text" v-model="apikey">
        <button @click="callModel">提问</button>
        <div v-if="response">{{ response }}</div>
    </div>
</template>

<script>
// import { LLMStream } from 'langchain';

export default {
    data() {
        return {
            apikey: '',
            userInput: '',
            response: ''
        };
    },
    methods: {
        async callModel() {
            try {
                // 构造请求的 body
                const requestBody = {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'user',
                            content: this.userInput
                        }
                    ],
                    stream: false
                };

                // 使用 this.$axios 调用后端 API，并设置请求头
                const response = await this.$axios.post(
                    'https://api.deepseek.com/chat/completions',
                    requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apikey}` // 替换为你的访问令牌
                    }
                });

                // 处理后端返回的响应数据
                this.response = response.data;
            } catch (error) {
                console.error(error);
                this.response = '出错啦！';
            }
        },

        // async callModelUseLLMStream() {
        //     try {
        //         // 创建 LLMStream 实例，用于处理流式输出
        //         const stream = new LLMStream({
        //             // 实现 callModel 方法，返回一个可读的流
        //             async callModel(text) {
        //                 // 构造请求的 body
        //                 const requestBody = {
        //                     model: 'deepseek-chat',
        //                     messages: [
        //                         {
        //                             role: 'user',
        //                             content: text
        //                         }
        //                     ],
        //                     stream: true // 设置为 true 以启用流式输出
        //                 };

        //                 const response = await this.$axios.post('URLA', requestBody, {
        //                     headers: {
        //                         'Content-Type': 'application/json',
        //                         'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // 替换为你的访问令牌
        //                     }
        //                 });
        //                 return response.data;
        //             }
        //         }.bind(this));

        //         // 监听流的数据事件
        //         stream.on('data', (chunk) => {
        //             // 处理流式输出的数据块
        //             const text = chunk.toString();
        //             this.response += text;
        //         });

        //         // 监听流的结束事件
        //         stream.on('end', () => {
        //             // 流结束时可以执行的操作
        //             console.log('流式输出结束');
        //         });

        //         // 启动流式输出
        //         await stream.start(this.userInput);
        //     } catch (error) {
        //         console.error(error);
        //         this.response = '出错啦！';
        //     }
        // }
    }
};
</script>