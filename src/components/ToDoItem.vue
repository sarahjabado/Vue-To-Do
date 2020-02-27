<template>
  <div :class="checkedClass" :id="itemContainerId">
    <div class="check">
      <input type="checkbox" :id="itemId" @click="updateCheckedStatus()" />
    </div>
    <div class="itemText"><label :for="itemId">{{text}}</label></div>
  </div>
</template>
<script>
export default {
  name: 'ToDoItem',
  props: {
    id: {
      type: Number,
      default: 0
    },
    text: {
      type: String,
      default: null
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isChecked: false
    }
  },
  computed: {
    itemId () {
      return 'item' + this.id
    },
    itemContainerId () {
      return 'itemContainer' + this.id
    },
    checkedClass () {
      const thisCheckBox = document.getElementById(this.itemId)
      if (thisCheckBox === null) {
        return 'toDoItem'
      }

      if (thisCheckBox.checked) {
        return 'toDoItem checked'
      }
      return 'toDoItem'
    }
  },
  watch: {
    isChecked: function (n) {
      const item = document.getElementById(this.itemContainerId)
      item.className = 'toDoItem' + (n ? ' checked' : '')

      return ''
    }
  },
  methods: {
    updateCheckedStatus: function () {
      const thisCheckBox = document.getElementById(this.itemId)
      this.isChecked = thisCheckBox.checked
      this.done = this.isChecked

      return ''
    }
  }
}
</script>
<style scoped lang="scss">
  .check {
    display: table-cell;
    width: 150px;
    height: 50px;
    line-height: 50px;

    &>input[type="checkbox"] {
      vertical-align: middle;
    }
  }
  .itemText {
    display: table-cell;
    height: 50px;
    padding-left: 6px;
    border-left: solid 1px rgba(0,0,0,.05);
    width: 90%;
    text-align: left;

    &>label {
      line-height: 50px;
      vertical-align: middle;
      display: inline-block;
      width: 100%;
      cursor: pointer;
    }
  }
  .toDoItem {
    border-bottom: solid 1px rgba(0,0,0,.05);
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 196, 0, 0.2);
    }

    &:last-of-type {
      border-bottom: none;
    }

    &.checked {
      background-color: rgba(0, 255, 0, .3);
      opacity: .4;
      label {
        text-decoration: line-through;
      }
    }
  }
</style>
