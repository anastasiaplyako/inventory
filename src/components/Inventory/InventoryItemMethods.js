import {Component} from 'react'
import React, {useState} from "react";
import firebase from '../../API/bdConnection'




class InventoryItemMethods extends React.Component {
    state = {
        count: this.props.count
    }

    updateHandler = () => {
        firebase.firestore().collection("inventory").doc(this.props.id).update({
            count: this.state.count,
        }).then(() => {
            console.info("Done");
        });
    }

    render() {
        return (
            <div className="inventory__info">
                <div className="inventory__info__name">{this.props.name}</div>
                <div className="inventory__info__count">
                    <input
                        type="number"
                        value={this.state.count}
                        onChange={e => this.setState({
                            count: e.target.value
                        })}
                    />
                    <button onClick={this.updateHandler} className="inventory__info__count_update">Обновить</button>
                    <button onClick={this.props.onDelete} className="inventory__info__count_close">
                        X
                    </button>
                </div>
            </div>)
    }
}


export default InventoryItemMethods;