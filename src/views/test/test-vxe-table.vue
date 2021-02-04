<template>
  <el-container direction="vertical">
    <el-main>
      <div style="height: 100%">
      <vxe-table
              border
              show-overflow
              height="100%"
              row-id="id"
              size="medium"
              :loading="loading2"
              :data="tableData2">
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="name" title="Name" sortable></vxe-table-column>
        <vxe-table-column field="sex" title="Sex"></vxe-table-column>
        <vxe-table-column field="age" title="Age"></vxe-table-column>
        <vxe-table-column field="rate" title="Rate"></vxe-table-column>
      </vxe-table>
      </div>
    </el-main>

    <el-footer>
      <vxe-pager
              border
              size="medium"
              :loading="loading2"
              :current-page="tablePage2.currentPage"
              :page-size="tablePage2.pageSize"
              :total="tablePage2.totalResult"
              :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
              @page-change="">
      </vxe-pager>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'test-vxe-table',
  data () {
    return {
      loading2: false,
      tableData2: [],
      tablePage2: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      }
    }
  }
}
</script>

<style scoped>

</style>
