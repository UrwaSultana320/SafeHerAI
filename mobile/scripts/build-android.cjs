// Use an existing Android Studio installation on Windows without changing system settings.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const env = { ...process.env };
if (process.platform === 'win32') {
  const temp = path.resolve(__dirname, '../../.build-tmp');
  fs.mkdirSync(temp, { recursive: true });
  env.TEMP = temp;
  env.TMP = temp;
}
const bundledJava = 'C:/Program Files/Android/Android Studio/jbr';
if (!env.JAVA_HOME && fs.existsSync(bundledJava)) {
  env.JAVA_HOME = bundledJava;
}
const sdk =
  env.ANDROID_HOME ||
  env.ANDROID_SDK_ROOT ||
  path.join(env.LOCALAPPDATA || '', 'Android', 'Sdk');
if (fs.existsSync(sdk)) {
  env.ANDROID_HOME = sdk;
}
// Windows environment names are case-insensitive; a spread object is not.
// Keep one PATH key so child Java processes can still resolve Node and SDK tools.
const inheritedPath = process.env.PATH || process.env.Path || '';
for (const key of Object.keys(env)) {
  if (key.toLowerCase() === 'path') {
    delete env[key];
  }
}
env.PATH = [
  env.JAVA_HOME && path.join(env.JAVA_HOME, 'bin'),
  path.dirname(process.execPath),
  inheritedPath,
]
  .filter(Boolean)
  .join(path.delimiter);
console.log(
  'Java:',
  env.JAVA_HOME || 'PATH',
  '\nAndroid SDK:',
  env.ANDROID_HOME || 'not configured',
);
const result = spawnSync(
  process.platform === 'win32' ? 'gradlew.bat' : './gradlew',
  ['assembleDebug', '--console=plain', ...process.argv.slice(2)],
  {
    cwd: path.join(__dirname, '../android'),
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);
if (result.error) {
  console.error(result.error.message);
}
process.exit(result.status ?? 1);
