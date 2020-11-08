import React, {Component} from "react";
import firebase from '../../API/bdConnection'

class InputTogglerAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nameInventory: '',
            number: null,
            update: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    addInventory(nameInventory, countInventory, placeInventory) {
        let filestore = firebase.firestore();
        filestore.collection("inventory").doc().set({
            name: nameInventory,
            count: countInventory,
            place: filestore.collection("places").doc(placeInventory) // main-101 – id места
        }).then(() => {
            console.info("Done");
        });
    }

    handleSubmit(event) {
        this.addInventory(this.state.nameInventory, this.state.number, this.props.idPlace);
        this.props.onChangeAfterAdd();
        event.preventDefault();
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="inventory__form_name">
                    <label>Название:</label>
                </div>
                <div className="inventory__form_value">
                    <input
                        type='text'
                        name='nameInventory'
                        onChange={this.myChangeHandler}
                    />
                </div>
                <div className="inventory__form_name">
                    <label> Количество:</label>
                </div>
                <div className="inventory__form_value">
                    <input
                        type='text'
                        name='number'
                        onChange={this.myChangeHandler}
                    />
                </div>
                <input type="submit" className="inventory__form_add" value="Отправить"/>
            </form>
        );
    }
}

export default InputTogglerAdd
