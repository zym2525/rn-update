package com.example.rnupdate;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;

import java.io.File;
import java.util.Objects;

import androidx.core.content.FileProvider;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RnUpdateExample";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null); //修改react-native-screens的崩溃bug
//    installApk("aihui222/huijiaoapp.apk");
  }

  public void installApk(String apkPath)
  {
    File externalFileRootDir=getExternalFilesDir(null);
    do{
      externalFileRootDir= Objects.requireNonNull(externalFileRootDir).getParentFile();
    }while (Objects.requireNonNull(externalFileRootDir).getAbsolutePath().contains("/Android"));
    String saveDir=Objects.requireNonNull(externalFileRootDir).getAbsolutePath();
    File file = new File(saveDir,apkPath);
    //安装应用
    Intent intent = new Intent();
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    intent.setAction(android.content.Intent.ACTION_VIEW);
    Uri uri = null;
    if(Build.VERSION.SDK_INT >= 24){
      uri = FileProvider.getUriForFile(this, getPackageName() + ".provider", file);
    } else {
      uri = Uri.fromFile(file);
    }
    Log.e("uri",uri.getPath());
    intent.setDataAndType(uri, "application/vnd.android.package-archive");
    startActivity(intent);
  }
}
