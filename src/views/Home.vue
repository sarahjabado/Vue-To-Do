<template>
  <div class="home">
    <h2>Simple VueJS To Do List</h2>
    <ToDoList
    :listItems="listItems"
    >
    </ToDoList>
    <button class="controls" @click="toggleAddForm" id="toggleButton">Add New</button> <button @click="clear">Clear Items</button> <button @click="clearDone" style="display: none;">Clear Completed Items</button>
    <div v-if="showAddForm" class="controls">
      <input type="text" id="addTextField" placeholder="New Item Name"> <button @click="saveAddNew">Add New Item</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ToDoList from '@/components/ToDoList.vue'

export default {
  name: 'Home',
  data () {
    return {
      showAddForm: false,
      listItems: []
    }
  },
  components: {
    ToDoList
  },
  watch: {
    showAddForm: function (n) {
      document.getElementById('toggleButton').innerText = (n === true ? 'Cancel' : 'Add New')
      return 1
    },
    listItems: function (items) {
      window.localStorage.setItem('toDoItems', JSON.stringify(items))
    }
  },
  mounted () {
    if (window.localStorage.getItem('toDoItems') !== null) {
      this.listItems = JSON.parse(window.localStorage.getItem('toDoItems'))
    }
  },
  methods: {
    toggleAddForm: function () {
      if (this.showAddForm === true) {
        this.showAddForm = false
        return
      }
      this.showAddForm = true
    },
    saveAddNew: function () {
      const value = document.getElementById('addTextField').value
      let oldId = 0
      if (this.listItems.length !== 0) {
        oldId = this.listItems.slice(-1)[0].id
      }
      this.listItems.push({
        id: oldId + 1,
        text: value,
        done: false
      })
      this.showAddForm = false
    },
    clear: function () {
      if (confirm('Are you sure you want to clear all items?')) {
        this.listItems = []
      }
    },
    clearDone: function () {
      this.listItems.forEach((item, index) => {
        if (item.done === true) {
          this.listItems.splice(index, 1)
        }
      })
    }
  }
}
</script>
<style lang="scss">
  body{
    background: #e3e3e3;
  }
  .home {
    border: solid 1px rgba(0,0,0,.3);
    background: #fff;
    max-width: 750px;
    margin: auto;
    padding: 24px;

    &>.controls {
      margin-top: 12px;
    }
  }
</style>
