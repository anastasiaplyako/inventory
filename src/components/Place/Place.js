import React, {Component} from 'react'

class Place extends React.Component {
    render() {
        return (
            <div>
                <h2> Name = {this.props.name} </h2>
            </div>)
    }
}

export default Place;