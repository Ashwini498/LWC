import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactListTable.getContacts';
import updateContacts from '@salesforce/apex/ContactListTable.updateContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLeadSourcePicklistValues from '@salesforce/apex/ContactListTable.getLeadSourcePicklistValues';
import { refreshApex } from '@salesforce/apex';

import CONTACT_UPDATE_SUCCESS from '@salesforce/label/c.Contact_Update_Success';
import CONTACT_UPDATE_ERROR from '@salesforce/label/c.Contact_Update_Error';
import NO_CONTACTS_EDITED_ERROR from '@salesforce/label/c.No_Contacts_Edited_Error';

export default class ContactListTable extends LightningElement {
@track contacts = [];
@track error;
@track draftValues = [];
@track isEditable = false; 
@track leadSourceOptions = [];
@track originalContacts = [];
wiredContactsResult;
 
    @wire(getContacts)
        wiredContacts(result) {
            this.wiredContactsResult = result;
                   if (result.data) {
            this.contacts = result.data;
            this.originalContacts = JSON.parse(JSON.stringify(result.data));
            this.error = undefined;
            } else if (result.error) {
            this.error = result.error.body.message;
            this.contacts = [];
         }
     }
 
        @wire(getLeadSourcePicklistValues)
             wiredLeadSourcePicklist({ error, data }) {
                   if (data) {
            this.leadSourceOptions = data.map(value => ({label: value, value: value}));
            this.error = undefined;
            } else if (error) {
            this.error = error.body.message;
            this.leadSourceOptions = [];
          }
    }
 
    get isNotEditable() {
return !this.isEditable;
}
 
                  handleInputChange(event) {
                         const contactId = event.target.dataset.id;
                         const field = event.target.dataset.field;
                         const value = event.target.value; 
                         const formattedValue = field === 'Birthdate' ? this.formatDate(value) : value;
 
          if (!this.draftValues[contactId]) {
              this.draftValues[contactId] = {};
            }
              this.draftValues[contactId][field] = formattedValue;
              this.contacts = this.contacts.map(contact => contact.Id === contactId ? { ...contact, [field]: formattedValue } : contact);
     }
 
           formatDate(dateString) {
            if (!dateString) return null;
             const date = new Date(dateString);
     return new Intl.DateTimeFormat('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'})
              .format(date);
           }
    handleEdit() {
      this.isEditable = true;
       this.draftValues = [];
}
    handleUpdate() {
      if (Object.keys(this.draftValues).length === 0) {
             this.dispatchEvent(
             new ShowToastEvent({
             title: 'Error',
             message: NO_CONTACTS_EDITED_ERROR,
             variant: 'error'
                 })
                    );
                return;
}
 
           const updatedContacts = this.contacts.map(contact => {
            const draft = this.draftValues[contact.Id];
           return { ...contact, ...draft };
});
          updateContacts({ contacts: updatedContacts })
              .then(() => {
                 const updatedContactIds = Object.keys(this.draftValues);
                 const updatedContactFirstNames = updatedContacts.filter(contact => updatedContactIds.includes(contact.Id)).map(contact => contact.FirstName).join(', ');
 
                 this.dispatchEvent(
                 new ShowToastEvent({
                 title: 'Success',
                 message: CONTACT_UPDATE_SUCCESS + ' Updated Contact First Names: ' + updatedContactFirstNames,
                 variant: 'success'
      })
);
            return refreshApex(this.wiredContactsResult);
             })
             .catch(error =>{this.showToast('Error', CONTACT_UPDATE_ERROR,'error');
                this.error = error; 
               }); 
}
           handleSave() {
              this.isEditable = false;
                 this.handleUpdate();
}
           handleCancel() {
              this.contacts = this.originalContacts.map(contact => {
                 return { ...contact };
       });
       this.draftValues = {};
       this.message = undefined;
       this.error = undefined;

       this.wiredContacts({ error: this.error, data: this.contacts });
    }
}