import FieldState from "@/views/system/field-state-variables";
import {addField, getField, updateField} from "@/api/system-manager";
import {copyObj} from "@/utils/util";

export const fieldEditorMixin = {
  mounted() {
    if (this.fieldState === FieldState.EDIT) {
      this.loadFieldProps()
    }
  },
  methods: {
    createNewField() {
      addField(this.fieldProps, this.entity).then(res => {
        if (res.error != null) {
          this.$message({ message: res.error, type: 'error' })
          return
        }

        this.$message.success('保存成功')
        this.$emit('fieldSaved')
      }).catch(res => {
        this.$message({ message: res.message, type: 'error' })
      })
    },

    modifyOldField() {
      updateField(this.fieldProps, this.entity).then(res => {
        if (res.error != null) {
          this.$message({ message: res.error, type: 'error' })
          return
        }

        this.$message.success('保存成功')
        this.$emit('fieldSaved')
      }).catch(res => {
        this.$message({ message: res.message, type: 'error' })
      })
    },

    cancelSave() {
      this.$emit('cancelSave')
    },

    loadFieldProps() {
      if (this.fieldState !== FieldState.EDIT) {
        return
      }

      getField(this.fieldName, this.entity).then(res => {
        if (res.error != null) {
          this.$message({ message: res.error, type: 'error' })
          return
        }

        copyObj(this.fieldProps, res.data)
        if (!this.fieldProps.fieldViewModel) {
          this.fieldProps.fieldViewModel = {}
        }

        //console.log( this.fieldProps )
      }).catch(res => {
        this.$message({ message: res.message, type: 'error' })
      })
    },
  }
}
