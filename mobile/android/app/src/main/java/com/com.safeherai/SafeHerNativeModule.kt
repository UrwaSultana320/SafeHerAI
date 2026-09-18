package com.safeherai

import android.annotation.SuppressLint
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.media.AudioManager
import android.media.MediaRecorder
import android.media.ToneGenerator
import android.os.VibrationEffect
import android.os.Vibrator
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File
import android.content.Intent
import androidx.core.content.FileProvider

class SafeHerNativeModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context), SensorEventListener {
  override fun getName() = "SafeHerNative"
  private val sensorManager by lazy { context.getSystemService(SensorManager::class.java) }
  private var sensorSubscribers = 0
  private var tone: ToneGenerator? = null
  private var recorder: MediaRecorder? = null
  private var recordingPath: String? = null

  private fun mapLocation(location: Location, source: String) = Arguments.createMap().apply {
    putDouble("latitude", location.latitude)
    putDouble("longitude", location.longitude)
    putDouble("accuracy", location.accuracy.toDouble())
    putString("source", source)
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  fun getLocation(timeoutMs: Double, promise: Promise) {
    val manager = context.getSystemService(LocationManager::class.java)
    val providers = listOf(LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER)
      .filter { manager.isProviderEnabled(it) }
    if (providers.isEmpty()) { promise.reject("LOCATION_UNAVAILABLE", "Location providers are disabled."); return }
    val last = providers.mapNotNull { manager.getLastKnownLocation(it) }.maxByOrNull { it.time }
    if (last != null && System.currentTimeMillis() - last.time < 120_000) {
      promise.resolve(mapLocation(last, "last")); return
    }
    var settled = false
    val handler = Handler(Looper.getMainLooper())
    lateinit var listener: LocationListener
    val timeout = Runnable {
      if (!settled) {
        settled = true; manager.removeUpdates(listener)
        if (last != null) promise.resolve(mapLocation(last, "last"))
        else promise.reject("LOCATION_TIMEOUT", "Location request timed out.")
      }
    }
    listener = object : LocationListener {
      override fun onLocationChanged(location: Location) {
        if (!settled) { settled = true; handler.removeCallbacks(timeout); manager.removeUpdates(this); promise.resolve(mapLocation(location, "fresh")) }
      }
      @Deprecated("Deprecated in Android") override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) = Unit
    }
    providers.forEach { manager.requestLocationUpdates(it, 0L, 0f, listener, Looper.getMainLooper()) }
    handler.postDelayed(timeout, timeoutMs.toLong().coerceIn(1000, 30000))
  }

  @ReactMethod fun addListener(eventName: String) = Unit
  @ReactMethod fun removeListeners(count: Double) = Unit

  @ReactMethod
  fun startSensors() {
    sensorSubscribers++
    if (sensorSubscribers > 1) return
    sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.let { sensorManager.registerListener(this, it, 20_000, 40_000) }
    sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)?.let { sensorManager.registerListener(this, it, 20_000, 40_000) }
  }

  @ReactMethod
  fun stopSensors() {
    sensorSubscribers = (sensorSubscribers - 1).coerceAtLeast(0)
    if (sensorSubscribers == 0) sensorManager.unregisterListener(this)
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit
  override fun onSensorChanged(event: SensorEvent) {
    val map = Arguments.createMap().apply {
      putString("sensor", if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) "accelerometer" else "gyroscope")
      putDouble("timestamp", System.currentTimeMillis().toDouble())
      putDouble("x", event.values[0].toDouble()); putDouble("y", event.values[1].toDouble()); putDouble("z", event.values[2].toDouble())
    }
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("SafeHerSensor", map)
  }

  @ReactMethod
  fun startAlarm() {
    if (tone == null) tone = ToneGenerator(AudioManager.STREAM_ALARM, 100)
    tone?.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 30_000)
    val vibrator = context.getSystemService(Vibrator::class.java)
    vibrator.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 500, 250, 500), 0))
  }

  @ReactMethod
  fun stopAlarm() {
    tone?.stopTone(); context.getSystemService(Vibrator::class.java).cancel()
  }

  @SuppressLint("MissingPermission")
  @ReactMethod
  fun startAudioRecording(promise: Promise) {
    try {
      val file = File(context.filesDir, "safeher-audio-${System.currentTimeMillis()}.m4a")
      val instance = if (android.os.Build.VERSION.SDK_INT >= 31) MediaRecorder(context) else @Suppress("DEPRECATION") MediaRecorder()
      instance.setAudioSource(MediaRecorder.AudioSource.MIC)
      instance.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
      instance.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
      instance.setOutputFile(file.absolutePath); instance.prepare(); instance.start()
      recorder = instance; recordingPath = file.absolutePath; promise.resolve(file.absolutePath)
    } catch (error: Exception) { recorder?.release(); recorder = null; promise.reject("RECORDING_FAILED", error) }
  }

  @ReactMethod
  fun stopAudioRecording(promise: Promise) {
    try { recorder?.stop(); recorder?.release(); recorder = null; promise.resolve(recordingPath) }
    catch (error: Exception) { recorder?.release(); recorder = null; promise.reject("RECORDING_FAILED", error) }
  }

  @ReactMethod
  fun saveSensorCsv(fileName: String, content: String, promise: Promise) {
    try {
      val directory = File(context.filesDir, "sensor_sessions").apply { mkdirs() }
      val safeName = fileName.replace(Regex("[^A-Za-z0-9._-]"), "_")
      val file = File(directory, safeName); file.writeText(content); promise.resolve(file.absolutePath)
    } catch (error: Exception) { promise.reject("CSV_SAVE_FAILED", error) }
  }

  @ReactMethod
  fun shareFile(path: String, promise: Promise) {
    try {
      val file = File(path)
      if (!file.exists() || !file.canonicalPath.startsWith(context.filesDir.canonicalPath)) throw IllegalArgumentException("Invalid local file")
      val uri = FileProvider.getUriForFile(context, "${context.packageName}.files", file)
      val intent = Intent(Intent.ACTION_SEND).apply { type = "text/csv"; putExtra(Intent.EXTRA_STREAM, uri); addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK) }
      context.startActivity(Intent.createChooser(intent, "Export SafeHer session").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); promise.resolve(true)
    } catch (error: Exception) { promise.reject("SHARE_FAILED", error) }
  }
}
