import {Component} from "react";
import InventoryItem from './InventoryItem.js'
import firebase from '../../API/bdConnection'
import React from 'react'
import InventoryItemMethods from './InventoryItemMethods'
import InputTogglerAdd from "./InputTogglerAdd";


class Inventory extends Component {
    state = {
        inventory: [
            {
                id: '',
                data: {},
                placeId: {},
            }
        ],
    }

    onChangeAfterAdd = () => {
        this.downloadHandler();
    }

    downloadHandler() {
        firebase.firestore().collection("inventory").get().then(response => {
            let docs = response.docs.map(x => ({
                id: x.id,
                data: x.data(),
                placeId: (x.data().place !== undefined) ? x.data().place.id : null
            }));
            this.setState({
                inventory: docs,
            });
        });
    }

    deleteHandler(index) {
        this.deleteInventory(this.state.inventory[index].id);
        let inventory = [...this.state.inventory];
        inventory.splice(index, 1);
        this.setState({inventory});
    }

    deleteInventory(id) {
        firebase.firestore().collection("inventory").doc(id).delete().then(() => {
            console.info("Done");
        });
    }

    downloadInventoryHandler() {
        this.setState({
            inventory: this.props.inventory,
        });
    }

    componentWillMount = () => {
        this.downloadInventoryHandler();
    }

    onChangeName = (name, index) => {
        let car = this.state.cars[index];
        car.name = name;
        let cars = [...this.state.cars];
        cars[index] = car;
        this.setState({cars})
    };

    renderNoChild() {
        return (
            <div>
                {this.state.inventory.map((element, index) => {
                    if (this.props.idArray.indexOf(element.placeId) !== -1) {
                        return (
                            <InventoryItemMethods
                                key={index}
                                id={element.id}
                                name={element.data.name}
                                place={element.placeId}
                                count={element.data.count}
                                onDelete={this.deleteHandler.bind(this, index)}
                            />
                        )
                    }
                })}
                <div className="inventory__form">
                    <h1>Добавить оборудование</h1>
                    <InputTogglerAdd
                        idPlace={this.props.idArray[0]}
                        onChangeAfterAdd={this.onChangeAfterAdd.bind(this)}
                    />
                </div>
            </div>)
    }

    renderWithChild() {
        return (
            this.state.inventory.map((item, index) => {
                if (this.props.idArray.indexOf(item.placeId) !== -1) {
                    return (
                        <div>
                            <InventoryItem
                                key={index}
                                name={item.data.name}
                                count={item.data.count}
                                place={item.placeId}
                            />
                            <hr/>
                        </div>
                    )
                }

            }))
    }

    render() {
        if (this.props.idArray.length === 1) {
            return (
                this.renderNoChild()
            )
        }
        if (this.props.idArray.length > 1) {
            return (
                this.renderWithChild()
            )
        }
        return (
            this.state.inventory.map((item, index) => {
                return (
                    <div>
                        <InventoryItem
                            key={index}
                            name={item.data.name}
                            year={index}
                            onDelete={this.deleteHandler.bind(this, index)}
                            onChangeName={(event) => this.onChangeName(event.target.value, index)}
                        />
                        <hr/>
                    </div>
                )
            }))
    }
}

export default Inventory;

