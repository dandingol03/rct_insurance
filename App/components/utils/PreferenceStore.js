/**
 * Created by danding on 17/3/25.
 * description:
 * 1 .get return a promise
 */
import SInfo from 'react-native-sensitive-info';

var PreferenceStore={
    put:function (key,val) {
        SInfo.setItem(key, val,{
            sharedPreferencesName:'shared_preferences',
            keychainService:'app'
        });
    },
    get:function (key) {
        return   SInfo.getItem(key,{
            sharedPreferencesName:'shared_preferences',
            keychainService:'app'
        });

    },
    delete:function (key) {
        return   SInfo.deleteItem(key,{
            sharedPreferencesName:'shared_preferences',
            keychainService:'app'
        });

    },

};
module.exports=PreferenceStore
