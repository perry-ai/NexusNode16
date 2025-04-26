<template>
  <div class="table-page">
    <el-card class="filter-card">
      <el-form :model="filterForm">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="16" :lg="8">
            <el-form-item label="时间" label-width="100px">
              <el-date-picker
                v-model="filterForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="4">
            <el-form-item label="地区" label-width="80px">
              <el-select v-model="filterForm.location" placeholder="请选择地区" style="width: 100%">
                <el-option
                  v-for="province in provinces"
                  :key="province"
                  :label="province"
                  :value="province">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="4">
            <el-form-item label="人物" label-width="80px">
              <el-select 
                v-model="filterForm.person" 
                multiple
                placeholder="请选择人物" 
                style="width: 100%">
                <el-option
                  v-for="role in roles"
                  :key="role"
                  :label="role"
                  :value="role">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="4">
            <el-form-item label="编号" label-width="80px">
              <el-input v-model="filterForm.code" placeholder="请输入编号" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="time"
          label="时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="location"
          label="地区"
          width="180">
        </el-table-column>
        <el-table-column
          prop="person"
          label="人物">
        </el-table-column>
        <el-table-column
          prop="code"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterForm: {
        time: '',
        location: '',
        person: '',
        code: ''
      },
      provinces: [
        '北京市','天津市','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省',
        '上海市','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省',
        '湖北省','湖南省','广东省','广西壮族自治区','海南省','重庆市','四川省','贵州省',
        '云南省','西藏自治区','陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区',
        '台湾省','香港特别行政区','澳门特别行政区'
      ],
      roles: ['车工','钳工','监理','协调','后勤','出纳','财务','销售'],
      tableData: []
    }
  },
  methods: {
    handleQuery() {
      // 模拟查询数据
      this.tableData = [
        {
          time: '2023-01-01',
          location: '北京',
          person: '张三',
          code: '001',
          status: '正常'
        },
        {
          time: '2023-01-02',
          location: '上海',
          person: '李四',
          code: '002',
          status: '正常'
        },
        {
          time: '2023-01-03',
          location: '广州',
          person: '王五',
          code: '003',
          status: '异常'
        }
      ]
    },
    resetForm() {
      this.filterForm = {
        time: '',
        location: '',
        person: '',
        code: ''
      }
      this.tableData = []
    }
  }
}
</script>

<style scoped>
.table-page {
  padding: 20px;
  width: calc(100% - 40px);
  margin: 0 auto;
  box-sizing: border-box;
}
.filter-card {
  margin-bottom: 20px;
  width: 100%;
}
.table-card {
  width: 100%;
  overflow-x: auto;
}
.el-table {
  width: 100% !important;
}
</style>
