import React, {Component} from 'react'

class InventoryItem extends React.Component {
    render() {
        return (
            <div className="inventory__block">
                <div className="inventory__block_name">
                    {this.props.name}
                </div>
                <div className="inventory__block_count">
                    {this.props.count}
                </div>
            </div>
        )
    }
}

export default InventoryItem;
