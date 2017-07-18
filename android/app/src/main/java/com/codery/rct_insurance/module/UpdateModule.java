package com.codery.rct_insurance.module;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import static android.R.attr.duration;
import static android.R.id.message;
import static com.baidu.location.h.j.S;

import com.codery.rct_insurance.update.CheckUpdateTask;
import com.codery.rct_insurance.update.Constants;


public class UpdateModule extends ReactContextBaseJavaModule {
    public UpdateModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UpdateAndroidModule";
    }

    @ReactMethod
    public void check() {
        new CheckUpdateTask(getReactApplicationContext(), Constants.TYPE_NOTIFICATION, false).execute();
    }
}
