package com.rnupdate;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;
import java.util.Objects;

@ReactModule(name = RnUpdateModule.NAME)
public class RnUpdateModule extends ReactContextBaseJavaModule {
    public static final String NAME = "RnUpdate";

  private ReactApplicationContext reactContext;

    public RnUpdateModule(ReactApplicationContext reactContext) {
      super(reactContext);
      this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void installApk(String apkPath)
    {
      try {
        File externalFileRootDir=reactContext.getExternalFilesDir(null);
        do{
          externalFileRootDir= Objects.requireNonNull(externalFileRootDir).getParentFile();
        }while (Objects.requireNonNull(externalFileRootDir).getAbsolutePath().contains("/Android"));
        String saveDir=Objects.requireNonNull(externalFileRootDir).getAbsolutePath();
        File file = new File(saveDir,apkPath);
        if(!file.exists()){
          Log.e("uri","not exists");
          return;
        }
        //安装应用
        Intent intent = new Intent();
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setAction(android.content.Intent.ACTION_VIEW);
        Uri uri = null;
        if(Build.VERSION.SDK_INT >= 24){
          uri = FileProvider.getUriForFile(reactContext, reactContext.getPackageName() + ".provider", file);
          intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
          uri = Uri.fromFile(file);
        }
        Log.e("uri",uri.getPath());
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        reactContext.startActivity(intent);
      }catch (final Exception e){
        Log.e("uri",e.toString());
        e.printStackTrace();
      }
    }

}
