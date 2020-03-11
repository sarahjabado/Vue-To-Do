<template>
  <div>
    <div v-if="isConnecting">Connecting to Server... Please wait.</div>
    <div v-if="!isConnecting && !isConnected">Failed to connect to server. Please reload the page to try again.</div>
    <div class="home" v-if="isConnected">
      <h2>Simple VueJS To Do List</h2>
      <ToDoList
      :listItems="listItems"
      @completed="markItemComplete"
      >
      </ToDoList>
      <button class="controls" @click="toggleAddForm" id="toggleButton">Add New</button> <button @click="clearDone" style="display: none;">Clear Completed Items</button> <button id="toggleButton2" @click="toggleShowRawData">Show Raw Data</button>
      <div v-if="showAddForm" class="controls">
        <input type="text" id="addTicketField" placeholder="Item Ticket"> <input type="text" id="addTextField" placeholder="New Item Name"> <button @click="saveWithServer">Add New Item</button>
      </div>
      <div v-if="showDataForm" class="dataContainerForm">
        <textarea id="dataContainer" v-model="rawData"></textarea><br>
        <button @click="loadData">Upload Raw Data</button>
      </div>
      <div class="clearActions">
        <button @click="clear" :disabled="disableClearItems">Clear Items</button>
      </div>
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
      showDataForm: false,
      disableClearItems: true,
      listItems: [],
      data: {},
      socket: null,
      isConnected: false,
      isConnecting: true
    }
  },
  components: {
    ToDoList
  },
  computed: {
    rawData: function () {
      return JSON.stringify(this.listItems)
    },
    availableTickets: function () {
      const tickets = []
      this.listItems.forEach((item) => {
        if (tickets.indexOf(item.ticket) !== -1) {
          tickets.push(item.ticket)
        }
      })
      return 1
    }
  },
  watch: {
    showAddForm: function (n) {
      document.getElementById('toggleButton').innerText = (n === true ? 'Cancel' : 'Add New')
      return 1
    },
    showDataForm: function (n) {
      document.getElementById('toggleButton2').innerText = (n === true ? 'Collapse Raw Data' : 'Show Raw data')
      return 1
    },
    listItems: function (items) {
      if (items.length === 0) {
        this.disableClearItems = true
      } else {
        this.disableClearItems = false
      }
      window.localStorage.setItem('toDoItems', JSON.stringify(items))
    }
  },
  mounted () {
    if (window.localStorage.getItem('toDoItems') !== null) {
      this.listItems = JSON.parse(window.localStorage.getItem('toDoItems'))
    }
    this.socket = new WebSocket('ws://localhost:9001')
    this.socket.onopen = (e) => {
      this.isConnected = true
      this.isConnecting = false
      this.socket.send('{"request":"FETCH_ALL"}')
    }

    this.socket.onerror = (e) => {
      console.log(e)
      this.isConnecting = false
    }

    this.socket.onmessage = (response) => {
      this.data = JSON.parse(response.data)
      console.log(this.data)
      switch (this.data.type) {
        case 'FETCH':
          break
        case 'FETCH_ALL':
          if (!this.data.items) {
            console.log('No items in database.')
          } else {
            this.listItems = this.data.items
          }
          break
        case 'INSERT':
          if (!this.data.item) {
            console.log('Nothing to add to the list.')
          } else {
            this.listItems.push(this.data.item)
          }
          break
        case 'COMPLETE':
          if (!this.data.item) {
            console.log('Nothing to delete')
          } else {
            this.listItems.splice(this.data.item, 1)
          }
          break
      }
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
    markItemComplete: function (item) {
      const completeItem = {
        request: 'COMPLETE',
        item: item
      }
      console.log('Sent', completeItem)
      this.socket.send(JSON.stringify(completeItem))
    },
    saveWithServer: function () {
      const value = document.getElementById('addTextField').value
      const ticket = document.getElementById('addTicketField').value
      if (!value) { // Value is mandatory.
        return
      }
      const newItem = {
        request: 'INSERT',
        item: {
          id: null,
          text: value,
          ticket: ticket,
          done: false
        }
      }

      this.socket.send(JSON.stringify(newItem))
      this.showAddForm = false
    },
    /**
     * @Deprecated
    */
    saveAddNew: function () {
      const value = document.getElementById('addTextField').value
      const ticket = document.getElementById('addTicketField').value
      if (!value) { // Value is mandatory.
        return
      }
      let oldId = 0
      if (this.listItems.length !== 0) {
        oldId = this.listItems.slice(-1)[0].id
      }
      this.listItems.push({
        id: oldId + 1,
        text: value,
        ticket: ticket,
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
    },
    toggleShowRawData: function () {
      if (this.showDataForm === true) {
        this.showDataForm = false
        return
      }
      this.showDataForm = true
    },
    loadData: function () {
      this.listItems = JSON.parse(document.getElementById('dataContainer').value)
      this.toggleShowRawData() // Auto collapse raw data import.
    }
  }
}
</script>
<style lang="scss">
  body{
    background: #e3e3e3;
    padding-top: 22px;
  }
  .home {
    border: solid 1px rgba(0,0,0,.3);
    background: #fff;
    max-width: 750px;
    margin: auto;
    padding: 24px;

    &>.controls {
      margin-top: 12px;

      &div {
        &>input {
          padding: 6px 12px;
        }
      }
    }
  }
  textarea {
    width: 60%;
    margin: 20px auto;
    height: 40%;
    opacity: .4;
  }
  textarea:hover {
    opacity: 1;
  }
  .dataContainerForm {
    border-top: solid 1px rgba(0,0,0,.3);
    margin-top: 12px;
  }
  .clearActions {
    margin-top: 12px;
  }
</style>
