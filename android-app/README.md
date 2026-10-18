# American Agrotech Android

Ứng dụng Android WebView tải nội dung trực tiếp từ website American. Nội dung web tự đồng bộ mỗi khi ứng dụng mở; chỉ thay đổi chức năng native mới cần phát hành APK mới.

## Build

Yêu cầu Java 17, Android SDK 35 và Gradle 8.9.

```bash
ANDROID_SDK_ROOT=/opt/android-sdk \
AMERICAN_KEYSTORE_PATH=/path/to/american-agrotech-release.jks \
AMERICAN_KEYSTORE_PASSWORD=... \
AMERICAN_KEY_ALIAS=american-agrotech \
AMERICAN_KEY_PASSWORD=... \
gradle :app:assembleRelease
```
