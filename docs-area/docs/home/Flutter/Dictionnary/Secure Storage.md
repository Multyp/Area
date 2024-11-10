---
title: Secure Storage
---

# Secure Storage Documentation

## What is Secure Storage?

**Secure Storage** refers to a mechanism that ensures the safe and encrypted storage of sensitive data such as API keys, tokens, passwords, and other private information. It prevents unauthorized access by leveraging encryption and using secure system components like the **Keychain** on iOS and **Keystore** or **EncryptedSharedPreferences** on Android.

When dealing with sensitive information in a mobile application, storing it securely is crucial to avoid data breaches or unauthorized use. Secure storage protects this data by ensuring it remains encrypted at rest and accessible only through secure channels.

---

## How Does Secure Storage Work?

Secure storage systems operate by encrypting data before it is stored, making it unreadable to unauthorized users. On mobile platforms, different storage mechanisms are used:

- **Android**: Secure Storage utilizes **Keystore** and **EncryptedSharedPreferences**, which are encrypted areas in the Android operating system that provide secure access to sensitive data. The Keystore provides hardware-backed security, while EncryptedSharedPreferences offers application-level encryption.

- **iOS**: Secure Storage uses **Keychain**, a secure, system-provided storage mechanism that stores sensitive data in an encrypted format, accessible only by the app or system.

Once stored, the data is retrieved and decrypted only when the app explicitly requests it, using the proper credentials or security keys.

---

## How to Use Secure Storage?

Flutter applications use the `flutter_secure_storage` plugin to provide secure storage functionality on both Android and iOS platforms. This plugin enables developers to store, retrieve, and delete sensitive data securely.

### Install Flutter Secure Storage Plugin

To start using secure storage in Flutter, install the **Flutter Secure Storage** plugin by running the following command inside your project directory:

```bash
flutter pub add flutter_secure_storage
```

Ensure that the plugin is added to your `pubspec.yaml` file:

```yaml
dependencies:
  flutter_secure_storage: ^9.2.2
```

### Storing Data

To store data securely, first, create an instance of `FlutterSecureStorage`:

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

void main() {
  FlutterSecureStorage secureStorage = const FlutterSecureStorage();
}
```

You can store key-value pairs in secure storage:

```dart
await secureStorage.write(key: 'apiKey', value: 'your_value');
```

**Important**: Always initialize Flutter widget bindings before accessing secure storage in your app's main entry point:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  FlutterSecureStorage secureStorage = const FlutterSecureStorage();
  await secureStorage.write(key: 'apiKey', value: 'your_value');
}
```

### Reading Data

To retrieve data from secure storage:

```dart
String? apiKey = await secureStorage.read(key: 'apiKey');
print(apiKey); // Outputs: your_value
```

### Deleting Data

To delete specific data stored by a key:

```dart
await secureStorage.delete(key: 'apiKey');
```

To confirm if a key exists:

```dart
bool exists = await secureStorage.containsKey(key: 'apiKey');
print(exists); // Outputs: false (after deletion)
```

### Clearing All Data

To remove all data stored in secure storage:

```dart
await secureStorage.deleteAll();
```

### Platform-Specific Configurations

#### Android Configurations

- **EncryptedSharedPreferences**: Use this instead of the Android Keystore for better performance and ease. Ensure it is enabled in the `AndroidOptions`:

```dart
FlutterSecureStorage secureStorage = const FlutterSecureStorage(
  aOptions: AndroidOptions(
    encryptedSharedPreferences: true,
  ),
);
```

- **Backup Exclusion**: Sensitive data should be excluded from automatic backups to avoid unauthorized access through backup files. Modify the `AndroidManifest.xml` to exclude Flutter Secure Storage from backup:

```xml
<application
  android:allowBackup="true"
  android:fullBackupContent="@xml/backup_rules">
</application>
```

Create the `backup_rules.xml` file:

```xml
<full-backup-content>
  <exclude domain="sharedpref" path="FlutterSecureStorage"/>
</full-backup-content>
```

#### iOS Configurations

Enable secure access to Keychain even when the app is in the background by using `IOSOptions`:

```dart
FlutterSecureStorage secureStorage = const FlutterSecureStorage(
  iOptions: IOSOptions(
    accessibility: KeychainAccessibility.first_unlock,
  ),
);
```

---

## Why Use Secure Storage?

1. **Sensitive Data Protection**: Secure storage ensures that sensitive information like passwords, tokens, and personal data are encrypted and safe from unauthorized access.
2. **Platform-Specific Security**: By leveraging platform-specific secure storage mechanisms like **Keychain** and **Keystore**, apps utilize the most secure methods available on the device.
3. **Compliance**: Many regulations, such as GDPR, require encryption of sensitive data to ensure privacy. Using secure storage helps maintain compliance with these legal requirements.
4. **Prevention of Data Leaks**: Secure storage makes sure that sensitive information is encrypted, reducing the risk of data leaks in case the app is compromised.

---

By following best practices and using secure storage, mobile applications can protect sensitive user data, maintain trust, and comply with regulatory standards, all while offering a smooth user experience.
