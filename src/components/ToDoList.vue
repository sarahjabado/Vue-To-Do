<template>
  <div class="toDoList">
    <ToDoItem
    v-for="item in listItems"
    :key="item.id"
    :id="item.id"
    :text="item.text"
    :done="item.done"
    ></ToDoItem>
    <div v-if="noItems" class="noItems">
      <i>There are no items in your To Do List. Add one to get started.</i>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ToDoItem from '@/components/ToDoItem.vue'

export default Vue.extend({
  name: 'ToDoList',
  components: {
    ToDoItem
  },
  props: {
    listItems: {
      type: Array
    }
  },
  computed: {
    noItems: function () {
      if (this.listItems.length === 0) {
        return true
      }
      return false
    }
  },
  methods: {

  }
})
</script>
<style lang="scss" scoped>
  .toDoList {
    max-width: 700px;
    margin: auto;
    border: solid 1px rgba(0,0,0,.05);
  }
  .noItems {
    padding: 12px;
    border: solid 1px rgba(0, 140, 255, 0.6);
    background: rgba(0, 140, 255, 0.2);
  }
</style>
