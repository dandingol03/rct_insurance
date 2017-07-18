package com.codery.rct_insurance;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.example.rctbaidulocation.BaiduLocationPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import cn.reactnative.modules.jpush.JPushPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.theweflex.react.WeChatPackage;

import com.codery.rct_insurance.reactPackage.AnExampleReactPackage;

import org.lovebing.reactnative.baidumap.BaiduMapPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new ReactVideoPackage(),
              new BaiduLocationPackage(),
              new ImagePickerPackage(),
              new VectorIconsPackage(),
              new JPushPackage(),
              new RNSensitiveInfoPackage(),
              new ReactNativeAudioPackage(),
              new RCTCameraPackage(),
              new RNSoundPackage(),
              new RNFetchBlobPackage(),
              new WeChatPackage(),
              new RNFSPackage(),
              new BaiduMapPackage(getApplicationContext()),
              new AnExampleReactPackage()

      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
