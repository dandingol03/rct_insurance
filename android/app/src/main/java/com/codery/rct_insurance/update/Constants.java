package com.codery.rct_insurance.update;

public class Constants {


    // json {"url":"http://192.168.205.33:8080/Hello/app_v3.0.1_Other_20150116.apk","versionCode":2,"updateMessage":"版本更新信息"}
    //139.129.96.231:3000
    //本机：192.168.1.111:3000

    public static final String APK_DOWNLOAD_URL = "http://139.129.96.231:3000/downloadAndroidApk";
    public static final String APK_UPDATE_CONTENT = "APK_UPDATE_CONTENT";
    static final String APK_VERSION_CODE = "versionCode";


    public static final int TYPE_NOTIFICATION = 2;

    static final int TYPE_DIALOG = 1;


    static final String TAG = "UpdateChecker";

    static final String UPDATE_URL = "http://139.129.96.231:3000/fetchApkInfo";
}
