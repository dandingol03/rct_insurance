import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');


const FacebookTabBar = React.createClass({
    tabIcons: [],

    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
    },

    render() {
        return <View style={[styles.tabs, this.props.style,{width:width*3/4,marginLeft:width/8}]}>
            {this.props.tabs.map((tab, i) => {

                var appended=null;
                if(i==0)
                {
                    appended={borderTopLeftRadius:6,borderBottomLeftRadius:6};
                }
                else if(i==this.props.tabs.length-1)
                {
                    appended={borderTopRightRadius:6,borderBottomRightRadius:6};
                }
                else{
                }

               if(this.props.activeTab==i)
               {
                   return (
                       <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)}
                                         style={[styles.tab,{backgroundColor:'rgba(17, 17, 17, 0.6)'},appended]}>


                           {
                               this.props.tabIcons&&this.props.tabIcons[i]?
                                   <Icon name={this.props.tabIcons[i]} size={24} color="#fff"/>:null
                           }
                           <Text style={{color:'#fff',fontWeight:'bold'}}>

                               {tab}
                           </Text>
                       </TouchableOpacity>
                   );

               }else{
                   return (
                       <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)}
                            style={[styles.tab,appended]}>

                           {
                               this.props.tabIcons&&this.props.tabIcons[i]?
                                   <Icon name={this.props.tabIcons[i]} size={24} color="#888"/>:null
                           }
                           <Text style={{color:'#888',fontWeight:'bold'}}>

                               {tab}
                           </Text>
                       </TouchableOpacity>
                   );
               }

            })}
        </View>;
    },
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        paddingBottom: 4,
        borderWidth:1,
        borderColor:'rgb(17, 193, 243)',
        padding:2
    },
    tabs: {
        flexDirection: 'row'
    },
});

export default FacebookTabBar;
