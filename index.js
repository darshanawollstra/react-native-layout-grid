import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const random = () => (
  Math.random().toString(36).slice(2)
);

export default class GridLayout extends Component {
  static propTypes = {
    itemsPerRow: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
  };

  groupItems = (items, itemsPerRow) => {
    const itemsGroups = [];
    let group = [];
    let length = 0;
    if (items) {
        length =  items.length;
        items.map((item, i) => {
          item.type = true
          console.log("Type is ", item.type)
          if (length === i+1) {
              item.type = false;
          }
          if (group.length === itemsPerRow) {
            itemsGroups.push(group);
            group = [item];
          } else {
            group.push(item);
          }
        });
    }
    if (group.length > 0) {
      itemsGroups.push(group);
    }
    return itemsGroups;
  };

  renderGroup = (group) => {
    // push empty data inside list if number of items is not equal to itemsPerRow
    const { itemsPerRow, renderItem } = this.props;
    /*if (group.length < itemsPerRow) {
        const difference = itemsPerRow - group.length;
        for (let x = 0; x < difference; x += 1) {
            group.push(undefined);
        }
    }*/

    const items = group.map((item, index) => (
      <View style={styles.group} key={random()}>
        {renderItem(item, index)}
      </View>
    ));

    return (
      <View style={styles.mainGroup} key={random()}>
        {items}
      </View>
    );
  };

  render() {
    const { items, itemsPerRow } = this.props;
    const groups = this.groupItems(items, itemsPerRow);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <ListView
        {...this.props}
        renderRow={this.renderGroup}
        enableEmptySections
        dataSource={ds.cloneWithRows(groups)}
      />
    );
  }
}
