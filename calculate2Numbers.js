import { LightningElement, api, track } from 'lwc';
import getSumResult from '@salesforce/apex/calculateNumbers.getSumResult';
import getSubResult from '@salesforce/apex/calculateNumbers.getSubResult';
import getMulResult from '@salesforce/apex/calculateNumbers.getMulResult';

export default class Calculate2Numbers extends LightningElement {
    @track firstNumber;
    @track secondNumber;
    @track result;
    @track errors;

    handleSum() {
        getSumResult({ firstNumber: this.firstNumber, secondNumber: this.secondNumber })
            .then(result => {
                this.result = result;
                this.errors = undefined;
                console.log(`Sum result: ${result}`);
            })
            .catch(error => {
                this.errors = this.parseError(error);
                console.error(`Error in getSumResult: ${this.errors}`);
            });
    }

    handleSub() {
        getSubResult({ firstNumber: this.firstNumber, secondNumber: this.secondNumber })
            .then(result => {
                this.result = result;
                this.errors = undefined;
                console.log(`Subtraction result: ${result}`);
            })
            .catch(error => {
                this.errors = this.parseError(error);
                console.error(`Error in getSubResult: ${this.errors}`);
            });
    }

    handleMul() {
        getMulResult({ firstNumber: this.firstNumber, secondNumber: this.secondNumber })
            .then(result => {
                this.result = result;
                this.errors = undefined;
                console.log(`Multiplication result: ${result}`);
            })
            .catch(error => {
                this.errors = this.parseError(error);
                console.error(`Error in getMulResult: ${this.errors}`);
            });
    }

    handleChange(event) {
        if (event.target.name === 'fstNumber') {
            this.firstNumber = parseInt(event.target.value);
        } else if (event.target.name === 'scdNumber') {
            this.secondNumber = parseInt(event.target.value);
        }
    }

    parseError(error) {
        if (Array.isArray(error.body)) {
            return error.body.map(e => e.message).join(', ');
        } else if (typeof error.body.message === 'string') {
            return error.body.message;
        }
        return JSON.stringify(error);
    }
}