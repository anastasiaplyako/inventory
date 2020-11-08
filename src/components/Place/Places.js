import {Component} from "react";
import firebase from "../../API/bdConnection";
import React from "react"
import Inventory from "../Inventory/Inventory";
import '../../SCSS/css.css'

let isUsedPlace = [];
let idLink;
let idArray = [];
let res = [];

class Places extends Component {

    state = {
        places: [{
            id: '',
            data: {},
            parts: undefined,
            isUsed: false,
        }],
        inventory: [
            {
                id: '',
                data: {},
                placeId: {},
            }
        ],
        shouldShowElem: false,
    }

    componentWillMount() {
        this.downloadPlacesHandler();
        this.downloadInventoryHandler();
    }

    downloadPlacesHandler() {
        firebase.firestore().collection("places").get().then(response => {
            let docs = response.docs.map(x => ({
                id: x.id,
                data: x.data(),
                parts: x.data().parts && x.data().parts.map(part => part.id)
            }));
            this.setState({places: docs});
        });
    }

    downloadInventoryHandler() {
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

    findChild(id) {
        let childId = [];
        let element = this.findElement(id);
        if (element.parts === undefined) {
            return childId;
        }
        element.parts.map((item) => {
            return this.findChild(item);
        })
    }

    isHaveInventory(idPlace) {
        let ishaveInventory = false;
        this.state.inventory.map((inventory, index) => {
            if (inventory.placeId === idPlace) {
                ishaveInventory = true;
            }
        });
        return ishaveInventory;
    }

    submitNote(id) {
        res = [];
        this.setState({
            shouldShowElem: true,
        });
        idLink = id;
        this.findAllChild(id);
    }

    findAllChild(id) {
        res.push(id);
        let element = this.findElement(id);
        if (element.parts === undefined) {
            return res;
        }
        element.parts.map((item) => {
            this.findAllChild(item);
        })
    }

    printTree(level) {
        if (isUsedPlace.indexOf(level.id) === -1) {
            isUsedPlace.push(level.id);
            if (level.parts !== undefined) {
                return (
                    <ul>
                        <li onClick={this.submitNote.bind(this, level.id)}>
                            level_id = {level.id}
                            {this.isHaveInventory(level.id)
                                ?
                                <span>
                                +
                                </span>
                                : null
                            }
                        </li>
                        {
                            level.parts.map((item) => {
                                isUsedPlace.push(item.id);
                                return this.printTree(this.findElement(item))
                            })
                        }
                    </ul>
                )
            }
        } else {
            return (
                <div></div>
            )
        }
        return (
            <div>
                <ul onClick={this.submitNote.bind(this, level.id)}>
                    along = {level.id}
                    {this.isHaveInventory(level.id)
                        ? <span>+</span>
                        : null
                    }
                </ul>
            </div>
        )
    }

    findElement(id) {
        let place = {};
        this.state.places.map((element, index) => {
            if (element !== undefined && element.id === id) {
                place = element;
            }
        });
        return place;
    }

    render() {
        isUsedPlace = [];
        return (
            <div className="block">
                <div className="place">
                    <h1>Здания и комнаты</h1>
                    {this.state.places.map((place) => {
                        if (place.parts !== undefined && isUsedPlace.indexOf(place) === -1) {
                            return (
                                <div className="block__place__item">
                                    {this.printTree(place)}
                                </div>
                            )
                        }
                    })}
                </div>
                <div className="inventory">
                    {this.state.shouldShowElem && <div>
                        <h1>Оборудование</h1>
                        <Inventory id={idLink} idArray={res} inventory={this.state.inventory}/>
                    </div>}
                </div>
            </div>
        )
    }
}

export default Places;

