package com.wecloudinfo.jsandroid;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;


public class JSAndroidActivity extends Activity {
	
	private Activity mActivity = null;
	private WebView mWebView = null;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		mActivity = this;
		
		showWebView();
	}
	
	@SuppressLint("SetJavaScriptEnabled")
	private void showWebView(){		// webView与js交互代码
		try {
			mWebView = new WebView(this);
			setContentView(mWebView);
			
			mWebView.requestFocus();
			
			mWebView.setWebChromeClient(new WebChromeClient(){
				@Override
				public void onProgressChanged(WebView view, int progress){
					JSAndroidActivity.this.setTitle("Loading...");
					JSAndroidActivity.this.setProgress(progress);
					
					if(progress >= 80) {
						JSAndroidActivity.this.setTitle("                              微云信息");
					}
				}
			});
			
			mWebView.setOnKeyListener(new View.OnKeyListener() {		// webview can go back
				@Override
				public boolean onKey(View v, int keyCode, KeyEvent event) {
					if(keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
						mWebView.goBack();
						return true;
					}
					return false;
				}
			});
			
			WebSettings webSettings = mWebView.getSettings();
			webSettings.setJavaScriptEnabled(true);
			webSettings.setDefaultTextEncodingName("utf-8");

			mWebView.addJavascriptInterface(getHtmlObject(), "jsObj");
			//mWebView.loadUrl("http://192.168.11.152:8020/HTML5_New/WebRoot/m/h5PluginDemo/index.html#!/index/menu.html");
			mWebView.loadUrl("file:///android_asset/index.html");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private Object getHtmlObject(){
		Object insertObj = new Object(){
			public String HtmlcallJava(){
				return "Html call Java";
			}
			
			public String HtmlcallJava2(final String param){
				return "Html call Java : " + param;
			}
			
			public void JavacallHtml(){
				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						mWebView.loadUrl("javascript: showFromHtml()");
						Toast.makeText(JSAndroidActivity.this, "clickBtn", Toast.LENGTH_SHORT).show();
					}
				});
			}
			
			public void JavacallHtml2(){
				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						mWebView.loadUrl("javascript: showFromHtml2('IT-homer blog')");
						Toast.makeText(JSAndroidActivity.this, "clickBtn2", Toast.LENGTH_SHORT).show();
					}
				});
			}
		};
		
		return insertObj;
	}

	
}
