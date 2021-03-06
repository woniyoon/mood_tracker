import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer, inject } from 'mobx-react';
import DropdownMenu from 'react-native-dropdown-menu';
import _ from 'lodash';
import ModalSelector from 'react-native-modal-selector';

@inject('rootStore')
@observer
export default class YearlyBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    this.rootStore = this.props.rootStore;
    this.diaryStore = this.rootStore.diaryStore;
    this.currentYear = this.diaryStore.currentYear;
    this.accountStore = this.rootStore.accountStore;
  }

  backButton() {
    return (
      <View style={styles.backButton}>
        <TouchableOpacity
          onPress={() => Actions.pop()}
          style={{ paddingRight: 10 }}
        >
          <Icon name="keyboard-arrow-left" size={42} color="#7F8C8D" />
        </TouchableOpacity>
      </View>
    );
  }
  changeCurrentYear = year => {
    this.rootStore.diaryStore.currentYear = year;
    this.diaryStore.createMonthlyData();
    Actions.Yearly();
  };

  renderTitle() {
    let arraySort = [];
    let dataArray = [];

    arraySort = Object.values(this.accountStore.yearArray);
    arraySort.sort((a, b) => (a < b ? 1 : -1));
    dataArray = [arraySort];

    if (dataArray[0][0] !== this.currentYear) {
      _.forEach(dataArray[0], element => {
        if (this.currentYear !== element) {
          dataArray[0].push(element);
        }
      });
      const exe = [0, 1];
      for (let i = 0; i < dataArray.length; i++) {
        for (let j = 0; j < exe.length; j++) {
          dataArray[i].splice(exe[j] - j, 1);
        }
        dataArray[0].unshift(this.currentYear);
      }
    }

    //for Android 
    let index = 0;
    const yearSourceArray = [];

    _.forEach(arraySort, element => {
      const yearSource = {
        key: index++,
        label: element
      };
      yearSourceArray.push(yearSource);
    });

    if (Platform.OS === 'ios') {
      return (
        <DropdownMenu
          style={{ flex: 1 }}
          bgColor={'white'}
          tintColor={'#666666'}
          activityTintColor={'green'}
          handler={(selection, row) => {
            this.setState({ text: dataArray[selection][row] });
            this.changeCurrentYear(dataArray[selection][row]);
          }}
          data={dataArray}
        />
      );
    }
    return (
      // for android
      <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>
        <ModalSelector
          data={yearSourceArray}
          initValue={this.currentYear}
          animationType='fade'
          onChange={option => {
            this.changeCurrentYear(option.label);
          }}
        />
      </View>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderTitle()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    height: 50,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5, 
    borderColor: '#cfcfcf',
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 8
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8
  }
});
