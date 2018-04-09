<template>
  <div id="app">
    {{error}}
      <v-data-table
        :headers="headers"
        :items="items"
        hide-actions
        class="elevation-1"
        item-key="name"
      >
        <template slot="items" slot-scope="props">
          <tr @click="getCustomerDetail(props.item._id, expanded)" class="customers">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.status }}</td>
            <td class="text-xs-center">{{ props.item.createdAt }}</td>
          </tr>
          <tr class="expand customer-info" v-show="props.item._id == customer._id">
            <td colspan="100%">
              <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-card dark color="primary">
                      <v-card-text class="px-0">
                        <h5>Website</h5>
                        <p>{{customer.website}}</p>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs4>
                    <v-card dark color="primary">
                      <v-card-text class="px-0">
                        <h5>Address</h5>
                        <p>{{customer.address}}</p>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs4>
                    <v-card dark color="primary">
                      <v-card-text class="px-0">
                        <h5>Phone</h5>
                        <p>{{customer.phone}}</p>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs2 class="status-customer">
                    <template>
                      <div class="text-xs-center">
                        <v-menu offset-y close-on-content-click>
                          <v-btn color="blue-grey lighten-4" dark slot="activator">{{MESSAGES.GENERAL.STATUS}}</v-btn>
                          <v-list>
                            <v-list-tile v-for="s in status" :key="s" @click.stop="changeStatus(customer._id, s)">
                              <v-list-tile-title>{{ s }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </div>
                    </template>
                  </v-flex>
                  <v-flex xs12>
                    <v-card dark color="primary">
                      <v-card-text class="px-0">
                        <h5>Description</h5>
                        <p>{{customer.descr}}</p>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12 class="content-notes">
                    <v-flex tag="h1" class="headline">{{MESSAGES.GENERAL.NOTES}}</v-flex>
                    <v-btn large color="blue-grey lighten-4" @click.stop="openDialog('save')" class="add-button">{{MESSAGES.GENERAL.NEW}}</v-btn>
                    <div v-for="n in notes" class="notes">
                      <span>{{MESSAGES.GENERAL.CREATED_AT}}: {{n.createdAt}}</span>
                      <v-card dark color="blue accent-2">
                        <v-card-text class="px-0" @click="update(n._id, n.note)">
                          {{n.note}}
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-flex>
                </v-layout>
              </v-container>    
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="warning">
            {{MESSAGES.ERROR.NO_DATA}}
          </v-alert>
        </template>
      </v-data-table>
      <!-- ADD NOTE DIALOG -->
      <template>
        <v-dialog
          v-model="dialog"
          fullscreen
          transition="dialog-bottom-transition"
          :overlay="false"
          scrollable
        >
          <v-card tile>
            <v-toolbar card dark color="light-blue darken-3">
              <v-btn icon @click.native="dialog = false" dark>
                <v-icon>{{MESSAGES.GENERAL.CLOSE}}</v-icon>
              </v-btn>
              <v-toolbar-title>{{MESSAGES.GENERAL.ADD_NOTE}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat @click="addNote(customer._id, comment)" v-show="action == 'save'">{{MESSAGES.GENERAL.SAVE}}</v-btn>
                <v-btn dark flat @click="editNote(currentNote, comment, customer._id)" v-show="action == 'update'">{{MESSAGES.GENERAL.UPDATE}}</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <template>
                  {{comment.note}}
                <v-form v-model="valid">
                  <v-text-field
                    label="Content of the note"
                    v-model="comment"
                    :rules="nameRules"
                    required
                    box multi-line
                  >{{comment.note}}</v-text-field>
                </v-form>
              </template>
            </v-card-text>
            <div style="flex: 1 1 auto;"/>
          </v-card>
        </v-dialog>
      </template>
  </div>
</template>

<script>
export default {
    data(){
      return{
        headers:[
          {
            text: 'Name',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'Status',
            align: 'center',
            sortable: true,
            value: 'status'
          },
          {
            text: 'Date',
            align: 'center',
            sortable: true,
            value: 'createdAt'
          }
        ],
        items: [],
        customer: {},
        notes: [],
        expanded: false,
        dialog: false,
        valid: false,
        comment: '',
        nameRules: [
          v => !!v || 'Content is required'
        ],
        action: null,
        currentNote: null,
        status: ['Prospective', 'Current', 'Non-active'],
        "close-on-content-click": true,
        error: null,
        MESSAGES: {
          ERROR: {
            SERVER: "Ups, we made a mistake, try again, please.",
            NO_DATA: "Sorry, nothing to display here :("
          },
          GENERAL: {
            STATUS: "Status",
            NEW: 'New',
            NOTES: 'Notes',
            CREATED_AT: 'Created at',
            CLOSE: 'close',
            ADD_NOTE: 'Add note',
            SAVE: 'Save',
            UPDATE: 'Update'
          }
        }
      }
    },

    created: function()
    {
      this.URI = 'http://localhost:3000';
      this.getCustomers();
    },

    methods: {
        /**
         * @function getCustomers
         * @description Get the costumers.
         */
        getCustomers(){
          var self = this;
          let uri = this.URI + '/customer';
          this.axios.get(uri).then((response) => {
              var data = self.formatDate(response.data);
              this.items = data;
          }, (err) => {
            this.error = self.MESSAGES.ERROR.SERVER;
          });
        },
        /**
         * @function getCustomerDetail
         * @description Get the detail of each customer.
         * @param {String} id Id of the customer.
         * @param {Boolean} expanded If false, the panel is close.
         */
        getCustomerDetail(id, expanded){
          let uri = this.URI + '/customer/?id=' +id;
          var self = this;
          this.axios.get(uri).then((response) => {
            this.customer = response.data;
            this.expanded = !expanded;
            self.getCustomerNotes(id);
          }, (err) => {
            this.error = self.MESSAGES.ERROR.SERVER;
          });
        },
        /**
         * @function getCustomerNotes
         * @description Get the notes of each customer and set the date in a legible format.
         * @param {String} id Id of the customer.
         */
        getCustomerNotes(id){
          var self = this;
          let uri = this.URI + '/notes/?id=' +id;
          this.axios.get(uri).then((response) => {
            var data = self.formatDate(response.data);
            this.notes = data;
          }, (err) => {
            this.error = self.MESSAGES.ERROR.SERVER;
          });
        },
        /**
         * @function addNote
         * @description Create a new note for a specific customer.
         * @param {String} id Id of the customer.
         */
        addNote(id, note){
          var self = this;
          let uri = this.URI + '/notes';
          let theNote = {
            customerId: id,
            note: note
          };

          this.axios.post(uri, theNote).then((response) => {
            this.notes.push(response.data);
            self.getCustomerNotes(id);
            self.dialog = false;
          }, (err) => {
            this.error = self.MESSAGES.ERROR.SERVER;
          })
        },
        /**
         * @function update
         * @description Manage the flow to update the notes, set the comments and the id to update.
         */
        update(id, note){
          this.comment = note;
          this.currentNote = id;
          this.openDialog('update');
        },
        /**
         * @function editNote
         * @description Edit a note for a specific customer.
         * @param {String} idNote Id of the note.
         * @param {String} note Content of the note.
         * @param {String} idCustomer
         */
        editNote(idNote, note, idCustomer){
          var self = this;
          let uri = this.URI + '/notes';
          let theNote = {
            id: idNote,
            note: note
          };

          this.axios.put(uri, theNote).then((response) => {
            self.getCustomerNotes(idCustomer);
            self.dialog = false;
          }, (err) => {
            this.error = self.MESSAGES.ERROR.SERVER;
          })
        },
        /**
         * @function openDialog
         * @description Open de dialog to edit or save the note.
         * @param {String} action There are two options, save and update, the option determine
         *                        if the user will create or update a note.
         */
        openDialog(action){
          if(action == 'save') this.comment = '';
          this.action = action;
          this.dialog = true;
        },
        /**
         * @function changeStatus
         * @param {String} id Id of the customer.
         * @param {String} status Determine the new status for the customer.
         *                        Prospective - Current - Non-active
         */
        changeStatus(id, status){
          var self = this;
          let uri = this.URI + '/customer';
          let newStatus = {
            id: id,
            status: status
          }
          this.axios.put(uri, newStatus).then((response) => {
            self.getCustomers();
          }, (err) => {
            this.error = self.MESSAGES.ERROR.SERVER;
          })
        },
        /**
         * @function formatDate
         * @description Give to the date a readeble format.
         * @param {Array} data Array of Customers or notes.
         */
        formatDate(data){
          var theData = data;
          for(let i=0; i<theData.length; i++){
            var date = new Date(theData[i].createdAt);
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();

            theData[i].createdAt = year + '/' + month + '/' + day;
          }
          return theData;
        }
    }
}
</script>
