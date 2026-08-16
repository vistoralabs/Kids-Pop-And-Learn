package com.kidspopandlearn.app;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Locale;

@CapacitorPlugin(name = "NativeTTS")
public class TextToSpeechPlugin extends Plugin {
    private TextToSpeech tts;
    private boolean isReady = false;

    @Override
    public void load() {
        super.load();
        try {
            tts = new TextToSpeech(getContext(), status -> {
                if (status == TextToSpeech.SUCCESS) {
                    isReady = true;
                    tts.setPitch(1.15f);
                    tts.setSpeechRate(0.85f);
                    tts.setLanguage(new Locale("en", "IN"));
                }
            });
        } catch (Exception e) {
            // Fallback gracefully if TTS service is unavailable
            isReady = false;
        }
    }

    @PluginMethod
    public void speak(PluginCall call) {
        String text = call.getString("text", "");
        String lang = call.getString("lang", "en");
        boolean queue = call.getBoolean("queue", false);

        if (text == null || text.trim().isEmpty()) {
            call.resolve();
            return;
        }

        if (tts == null) {
            call.resolve();
            return;
        }

        try {
            if ("hi".equalsIgnoreCase(lang)) {
                Locale hiLocale = new Locale("hi", "IN");
                int res = tts.setLanguage(hiLocale);
                if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts.setLanguage(new Locale("en", "IN"));
                }
            } else {
                int res = tts.setLanguage(new Locale("en", "IN"));
                if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts.setLanguage(Locale.US);
                }
            }

            int queueMode = queue ? TextToSpeech.QUEUE_ADD : TextToSpeech.QUEUE_FLUSH;
            String utteranceId = "utt_" + System.currentTimeMillis();
            tts.speak(text, queueMode, null, utteranceId);
            
            JSObject ret = new JSObject();
            ret.put("spoken", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (tts != null) {
            try {
                tts.stop();
            } catch (Exception ignored) {}
        }
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) {
            try {
                tts.stop();
                tts.shutdown();
            } catch (Exception ignored) {}
        }
        super.handleOnDestroy();
    }
}
