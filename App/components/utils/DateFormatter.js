/**
 * Created by danding on 17/4/3.
 */


var DateFormatter={
    format:function (pattern,val) {
        if(Object.prototype.toString.call(pattern)=='[object String]')
        {
            var flag=null;
            var holderC=0;
            var regStr='';
            pattern.split('').map(function (holder,i) {


                switch(holder)
                {
                    case ' ':
                        regStr+='\s';
                        break;
                    case '-':
                        regStr+='-';
                        break;
                    case ':':
                        regStr+='\:';
                        break;
                    default:
                        if(flag==holder)
                        {
                            holderC++;
                            if(i==pattern.split('').length-1)
                            {
                                regStr+='([\\d]{'+holderC+'})';
                            }
                        }
                        else
                        {
                            regStr+='([\\d]{'+holderC+'})';
                            flag=holder;
                            holderC++;
                        }
                        break;
                }

            });

            var reg=new RegExp(regStr)
            var re=reg.exec(val);
            if(re)
            {
                return re[1];
            }else{
                return null;
            }

        }else{
            return null
        }
    }

}
module.exports=DateFormatter;
