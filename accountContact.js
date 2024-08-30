import { LightningElement, track, wire } from 'lwc';
import createAccount from '@salesforce/apex/accountContr.createAccount';
import createContact from '@salesforce/apex/contactContr.createContact';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';


export default class AccountContact extends NavigationMixin(LightningElement) {
    @track accountName = '';
    @track industry = '';
    @track rating = '';
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track message = '';
    @track error;
    @track accountId; // Track accountId 

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    accountObjectInfo;

    @wire(getPicklistValues, {
        recordTypeId: '$accountObjectInfo.data.defaultRecordTypeId',
        fieldApiName: RATING_FIELD
    })
    ratingPicklistValues(result) {
        if (result.data) {
            console.log('Rating Picklist Values:', result.data.values);
            this.ratingPicklistValues = result.data.values;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
            this.ratingPicklistValues = undefined;
        }
    }
    @wire(getPicklistValues, {
        recordTypeId: '$accountObjectInfo.data.defaultRecordTypeId',
        fieldApiName: INDUSTRY_FIELD
    })
    industryPicklistValues(result) {
        if (result.data) {
            console.log('Industry Picklist Values:', result.data.values);
            this.industryPicklistValues = result.data.values;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
            this.industryPicklistValues = undefined;
        }
    }

    handleAccountChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handleSubmit() {
        createAccount({ 
            name: this.accountName,
            industry: this.industry,
            rating: this.rating
        })
        .then(result => {
            this.accountId = result.Id; // Saving newly created account Id
            return createContact({ 
                firstName: this.firstName, 
                lastName: this.lastName, 
                email: this.email, 
                phone: this.phone, 
                accountId: this.accountId 
            });
        })
        .then(Contact => {
            this.message = 'Account and Contact created successfully!';
            this.error = undefined;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: this.message,
                    variant: 'success',
                })
                );

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.accountId,
                    objectApiName: 'Account',
                    actionName: 'view'
                }
            });
        })
        .catch(error => {
            this.error = error.body.message;
            this.message = undefined;

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Creating records',
                    message: this.error,
                    variant: 'error',
                })
                );
        });
    }
    navigationToRecordPage(recordId){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            arrtibute: {
                recordId: recordId,
                objectName: 'Account',
                actionName: 'view'
            }
        });
    } 
}
