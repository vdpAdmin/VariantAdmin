<template>
  <el-form ref="testForm" :model="formModel" :rules="rules">
    <el-form-item :label="'测试'" :label-width="formModel.lw + 'px'">
      <el-input type="text"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input-number v-model.number="formModel.lw"></el-input-number>
    </el-form-item>

    <el-form-item label="姓名" prop="name">
      <el-input type="text" v-model="formModel.name"></el-input>
    </el-form-item>
    <el-button @click="submitClick">测试提交</el-button>
  </el-form>
</template>

<script>
  export default {
    name: 'test-el-form',
    data () {
      return {
        formModel: {
          lw: 60,
          name: '',
        },

        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {pattern: /^[A-Za-z\d]+$/, message: '请以英文字母、数字开头，不能包含中文字符', trigger: 'blur'},
            {min: 2, max: 30, message: '请输入至少两个字符', trigger: 'blur'},
          ],
        }
      }
    },

    methods: {
      submitClick() {
        this.$refs['testForm'].validate((result) => {
          if (result) {
            this.$message.success("表单验证成功！")
          } else {
            this.$message.error("表单验证失败！")
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
