/**
 * Created by dingyiming on 2017/2/16.
 */
/**
 * "yyyy-MM-dd hh:mm:ss
 *
 */
import _ from 'lodash';
let DateFilter={

    filter:(date,params)=>{
        var tmp=_.cloneDeep(date);
        if(Object.prototype.toString.call(date)!="[object Date]")
        {
            tmp=new Date(date);
        }
        var year=tmp.getFullYear();
        var month=tmp.getMonth()+1;
        var day=tmp.getDate();
        var hour=tmp.getHours();
        var minute=tmp.getMinutes();
        var second=tmp.getSeconds();


        var re=params.toLowerCase();

        if(re.indexOf('yyyy')!=-1)
        {
            re=re.replace('yyyy',year);
        }
        if(re.indexOf('-mm-')!=-1)
        {
            if(month.toString().length==1)
                re=re.replace('-mm-','-0'+month+'-');
            else
                re=re.replace('-mm-','-'+month+'-');
        }
        if(re.indexOf('dd')!=-1)
        {
            if(day.toString().length==1)
                re=re.replace('dd','0'+day);
            else
                re=re.replace('dd',day);
        }
        if(re.indexOf('hh')!=-1)
        {
            if(hour.toString().length==1)
                re=re.replace('hh','0'+hour);
            else
                re=re.replace('hh',hour);
        }
        if(re.indexOf(':mm')!=-1||re.indexOf('mm:')!=-1)
        {
            if(re.indexOf(':mm')!=-1)
            {
                if(minute.toString().length==1)
                    re=re.replace(':mm',':0'+minute);
                else
                    re=re.replace(':mm',':'+minute);
            }
            if(re.indexOf('mm:')!=-1)
            {
                if(minute.toString().length==1)
                    re=re.replace('mm:','0'+minute+':');
                else
                    re=re.replace('mm:',minute+':');
            }
        }
        if(re.indexOf('ss')!=-1)
        {
            if(second.toString().length==1)
                re=re.replace('ss','0'+second);
            else
                re=re.replace('ss',second);
        }

        return re;
    }
}
module.exports=DateFilter;
