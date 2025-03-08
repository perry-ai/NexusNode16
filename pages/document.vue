<template>
    <div>
        <!-- Excel上传 -->
        <el-upload action="/api/upload-excel" :on-success="handleExcelSuccess" accept=".xlsx">
            <el-button>上传Excel</el-button>
        </el-upload>
        <div v-if="excelA1">A1内容：{{ excelA1 }}</div>

        <!-- Excel下载 -->
        <el-button @click="downloadExcel">下载Excel模板</el-button>

        <!-- Word上传 -->
        <el-upload action="/api/upload-word" :on-success="handleWordSuccess" accept=".docx">
            <el-button>上传Word</el-button>
        </el-upload>
        <div v-if="wordContent">Word内容：{{ wordContent }}</div>

        <!-- Word下载 -->
        <el-button @click="downloadWord">下载Word模板</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            excelA1: '',
            wordContent: ''
        }
    },
    methods: {
        async handleExcelSuccess(response) {
            this.excelA1 = response.content
        },
        async handleWordSuccess(response) {
            this.wordContent = response.content
        },
        downloadExcel() {
            window.location.href = '/api/download-excel'
        },
        downloadWord() {
            window.location.href = '/api/download-word'
        }
    }
}
</script>