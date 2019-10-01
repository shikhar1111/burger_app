import React, {Component} from "react"

import axios from "../../../axios-orders"
import Button from "../../../components/UI/Button/Button"
import classes from "./ContactData.css"
import Spinner from "../../../components/UI/Spinner/Spinner"
import Input from "../../../components/UI/Input/Input"

class ContactData extends Component {
    state = {
        orderForm:{
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                    },
                    value:'',
                    validation:{
                        required:true
                    }
                },
                street:  {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Street'
                    },
                    value:'',
                    validation:{
                        required:true
                    }
                },
                zipCode:  {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Zip Code'
                    },
                    value:'',
                    validation:{
                        required:true,
                        minlength:5,
                        maxlength:5
                    }
                },
                country:  {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Country'
                    },
                    value:'',
                    validation:{
                        required:true
                    }
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Email'
                    },
                    value:'',
                    validation:{
                        required:true
                    }
                },
                deliveryMethod:  {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            {value:'fastest', displayValue:'Fastest'},
                            {value:'cheapest', displayValue:'Cheapest'}
                        ]
                    },
                    value:''
                } 
        },
        loading: false
    };

    checkValidity(value,rules) {
        let isValid = true;

        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minlength) {
            isValid = value.length >=rules.minlength && isValid;
        }

        if(rules.maxlength) {
            isValid = value.length <=rules.maxlength && isValid;
        }

        return isValid
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for ( let formElementIdentifier in this.state.orderForm ) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        };
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });
    };

    inputChangeHandler = (event,inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = { ...updatedOrderForm[inputIdentifier]}
        updatedFormElement.value = event.target.value
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedOrderForm[inputIdentifier] = updatedFormElement
        this.setState({orderForm:updatedOrderForm})
    }

    render() {

        const formElementsArray = []
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangeHandler (event,formElement.id) }/>
                ))}
                <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner/>;
        }

        return(
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Details</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;
