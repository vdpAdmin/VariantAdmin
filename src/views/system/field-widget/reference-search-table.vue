<template>
  <el-container>
    <el-header>
      <div class="search-panel-top">
        <el-input type="text" size="small" placeholder="请输入关键词搜索">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </el-header>
    <el-main>
      <SimpleTable :columns="columns" :data="tableData" :pagination="page" :show-check-box="false" :height="tableHeight"
                   @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                   table-size="small" table-width="100% !important">
        <el-table-column slot="table_operation" align="center" label="操作" width="100" :resizable="true" fixed="right">
          <template slot-scope="scope">
            <el-button class="" icon="el-icon-check" @click="selectRecord(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </SimpleTable>
    </el-main>
  </el-container>
</template>

<script>
  import { setColumnFormatter } from '@/utils/util'
  import { refFieldQuery } from '@/api/crud'

  export default {
    props: {
      entity: String,
      refField: String,
      tableHeight: {
        type: String,
        default: '480px'
      }
    },
    name: "ReferenceSearchTable",
    data() {
      return {
        idField: null,
        nameField: null,
        columns: [],
        tableData: [],
        page: {
          pageNo: 1,
          limit: 10,
          sizes: [10, 20, 30],
          total: 0
        },
      }
    },

    mounted() {
      this.initTable()
    },

    methods: {
      // 改变分页大小处理
      handleSizeChange(val) {

      },

      // 翻页处理
      handleCurrentChange(val) {

      },

      initTable() {
        refFieldQuery(this.entity, this.refField, this.page.pageNo, this.page.limit).then(res => {
          if (res.error != null) {
            this.$message({message: res.error, type: 'error'})
          } else {
            this.idField = res.data.idFieldName
            this.nameField = res.data.nameFieldName
            let columnList = res.data.columnList
            columnList.forEach(cl => {
              setColumnFormatter(cl)
            })
            this.columns = columnList
            this.tableData = res.data.dataList
            //console.log(this.tableData)
            this.page.total = res.data.pagination.total
          }
        }).catch(res => {
          this.$message({message: res.error, type: 'error'})
        })
      },

      selectRecord(row) {
        //console.log(row.departmentId)
        //console.log(row.departmentName)
        this.$emit('recordSelected', {
          'id': row[this.idField],
          'label': row[this.nameField],
        })
      },

      searchData() {
        //TODO
      },

    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-header {
    padding: 0 12px;
  }

  ::v-deep .el-main {
    padding: 6px;
  }
</style>
