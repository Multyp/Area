# Mockito and Build Runner in Flutter Testing

## Table of Contents
1. [Introduction](#introduction)
2. [Setup and Configuration](#setup-and-configuration)
3. [Understanding Mockito in Our Codebase](#understanding-mockito-in-our-codebase)
4. [Build Runner Integration](#build-runner-integration)
5. [Mock Generation](#mock-generation)
6. [Testing Patterns](#testing-patterns)
7. [Best Practices](#best-practices)
8. [Advanced Usage](#advanced-usage)
9. [Troubleshooting](#troubleshooting)
10. [Examples from Our Codebase](#examples-from-our-codebase)

## Introduction

Mockito and Build Runner are essential tools in our Flutter testing infrastructure. In our codebase, we use these tools primarily for testing services and dependencies, particularly focusing on the secure storage implementation.

### Why Mockito?
Mockito allows us to create mock objects that simulate the behavior of real objects in controlled ways. This is particularly useful when testing components that depend on external services or complex dependencies.

### Why Build Runner?
Build Runner automates the generation of mock classes, reducing boilerplate code and ensuring type safety in our tests.

## Setup and Configuration

### Dependencies
In our `pubspec.yaml`, we have the following test dependencies:


```yaml title="pubspec.yaml"
dev_dependencies:
  flutter_test:
    sdk: flutter

  mockito: ^5.4.4
  build_runner: ^2.4.8

  flutter_lints: ^4.0.0
```


### Build Runner Configuration
Build Runner is configured to generate mock classes automatically. The generation is triggered through our Makefile:


```Makefile title="Makefile"
.PHONY: test
test:
	@echo "Running Flutter tests..."
	$(FLUTTER_BIN) test
```


## Understanding Mockito in Our Codebase

### Mock Generation Annotations
We use the `@GenerateMocks` annotation to specify which classes need mocking. For example, in our storage service tests:


```dart title="test/storage_service_test.dart"
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:area/src/services/storage_service.dart';

// Generate mock class
@GenerateMocks([FlutterSecureStorage])
import 'storage_service_test.mocks.dart';
```


### Generated Mocks
The generated mock class for FlutterSecureStorage is comprehensive and handles all methods of the original class:


```dart title="test/storage_service_test.mocks.dart"
/// A class which mocks [FlutterSecureStorage].
///
/// See the documentation for Mockito's code generation for more information.
class MockFlutterSecureStorage extends _i1.Mock
    implements _i2.FlutterSecureStorage {
  MockFlutterSecureStorage() {
    _i1.throwOnMissingStub(this);
  }

  @override
  _i2.IOSOptions get iOptions => (super.noSuchMethod(
        Invocation.getter(#iOptions),
        returnValue: _FakeIOSOptions_0(
          this,
          Invocation.getter(#iOptions),
        ),
      ) as _i2.IOSOptions);

  @override
  _i2.AndroidOptions get aOptions => (super.noSuchMethod(
```


## Build Runner Integration

### Running Build Runner
To generate mock classes, we use the following command:
```bash
flutter pub run build_runner build
```

Or through our Makefile:
```bash
make test
```

### Watch Mode
For development, you can run build_runner in watch mode:
```bash
flutter pub run build_runner watch
```

## Mock Generation

### Anatomy of Generated Mocks
The generated mocks include:
1. Method stubs
2. Verification capabilities
3. Argument matchers
4. Smart null safety handling

Example from our codebase:

```dart title="test/storage_service_test.mocks.dart"
  @override
  _i4.Future<void> write({
    required String? key,
    required String? value,
    _i2.IOSOptions? iOptions,
    _i2.AndroidOptions? aOptions,
    _i2.LinuxOptions? lOptions,
    _i2.WebOptions? webOptions,
    _i2.MacOsOptions? mOptions,
    _i2.WindowsOptions? wOptions,
  }) =>
      (super.noSuchMethod(
        Invocation.method(
          #write,
          [],
          {
            #key: key,
            #value: value,
            #iOptions: iOptions,
            #aOptions: aOptions,
            #lOptions: lOptions,
            #webOptions: webOptions,
            #mOptions: mOptions,
            #wOptions: wOptions,
          },
        ),
        returnValue: _i4.Future<void>.value(),
        returnValueForMissingStub: _i4.Future<void>.value(),
      ) as _i4.Future<void>);

```


## Testing Patterns

### Setting Up Test Cases
Our test structure follows a consistent pattern:


```dart title="test/storage_service_test.dart"
void main() {
  late StorageService storageService;
  late MockFlutterSecureStorage mockSecureStorage;

  setUp(() {
    mockSecureStorage = MockFlutterSecureStorage();
    // Inject the mock into StorageService
    storageService = StorageService(storage: mockSecureStorage);
  });
```


### Mocking Method Responses
We use `when` to define mock behavior:


```dart title="test/storage_service_test.dart"
        when(mockSecureStorage.write(
          key: 'auth_token',
          value: token,
        )).thenAnswer((_) async {});

        await storageService.saveToken(token);

        verify(mockSecureStorage.write(
          key: 'auth_token',
          value: token,
        )).called(1);
      });
```


### Verification
We verify method calls using `verify`:


```dart title="test/storage_service_test.dart"
      test('deleteToken should remove token from secure storage', () async {
        when(mockSecureStorage.delete(key: 'auth_token'))
            .thenAnswer((_) async {});

        await storageService.deleteToken();

        verify(mockSecureStorage.delete(key: 'auth_token')).called(1);
      });
```


## Best Practices

### 1. Group Related Tests
We organize tests into logical groups:

```dart title="test/storage_service_test.dart"
  group('StorageService', () {
    group('Token Operations', () {
      test('saveToken should write token to secure storage', () async {
        const token = 'test_token';

        when(mockSecureStorage.write(
          key: 'auth_token',
          value: token,
        )).thenAnswer((_) async {});

        await storageService.saveToken(token);

        verify(mockSecureStorage.write(
          key: 'auth_token',
          value: token,
        )).called(1);
      });

      test('getToken should return token from secure storage', () async {
        const token = 'test_token';

        when(mockSecureStorage.read(key: 'auth_token'))
            .thenAnswer((_) async => token);

        final result = await storageService.getToken();

        expect(result, token);
        verify(mockSecureStorage.read(key: 'auth_token')).called(1);
      });

      test('deleteToken should remove token from secure storage', () async {
        when(mockSecureStorage.delete(key: 'auth_token'))
            .thenAnswer((_) async {});

        await storageService.deleteToken();

        verify(mockSecureStorage.delete(key: 'auth_token')).called(1);
      });
    });

```


### 2. Error Handling Tests
We include specific tests for error scenarios:

```dart title="test/storage_service_test.dart"
    group('Error Handling', () {
      test('getToken should return null when storage throws error', () async {
        when(mockSecureStorage.read(key: 'auth_token'))
            .thenThrow(Exception('Storage error'));

        final result = await storageService.getToken();

        expect(result, null);
      });

      test('getCredentials should return null values when storage throws error',
          () async {
        when(mockSecureStorage.read(key: anyNamed('key')))
            .thenThrow(Exception('Storage error'));

        final result = await storageService.getCredentials();

        expect(result, {'email': null, 'password': null});
      });
    });
```


### 3. Mock Setup
Always set up mocks in the `setUp` method:

```dart title="test/storage_service_test.dart"
  setUp(() {
    mockSecureStorage = MockFlutterSecureStorage();
    // Inject the mock into StorageService
    storageService = StorageService(storage: mockSecureStorage);
  });
```


## Advanced Usage

### 1. Argument Matchers
We use argument matchers for flexible verification:

```dart title="test/storage_service_test.dart"
        when(mockSecureStorage.read(key: anyNamed('key')))
            .thenThrow(Exception('Storage error'));

        final result = await storageService.getCredentials();

        expect(result, {'email': null, 'password': null});
      });
```


### 2. Multiple Return Values
You can chain multiple return values:
```dart
when(mockSecureStorage.read(key: anyNamed('key')))
    .thenAnswer((_) async => 'first')
    .thenAnswer((_) async => 'second');
```

### 3. Exception Throwing
Testing error scenarios:

```dart title="test/storage_service_test.dart"
        when(mockSecureStorage.read(key: 'auth_token'))
            .thenThrow(Exception('Storage error'));

        final result = await storageService.getToken();

        expect(result, null);
      });
```


## Troubleshooting

### Common Issues

1. **Build Runner Conflicts**
   Solution: Clean and rebuild
   ```bash
   flutter pub run build_runner clean
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

2. **Mock Generation Failures**
   - Ensure all dependencies are properly imported
   - Check that the class being mocked is accessible
   - Verify that the class doesn't have private members that need mocking

3. **Verification Failures**
   - Check argument matchers
   - Verify method call counts
   - Ensure mock setup matches expected usage

## Examples from Our Codebase

### Complete Test Suite Example
Our storage service test demonstrates comprehensive testing:

1. **Setup and Initialization**

```dart title="test/storage_service_test.dart"
void main() {
  late StorageService storageService;
  late MockFlutterSecureStorage mockSecureStorage;

  setUp(() {
    mockSecureStorage = MockFlutterSecureStorage();
    // Inject the mock into StorageService
    storageService = StorageService(storage: mockSecureStorage);
  });

```


2. **Token Operations**

```dart title="test/storage_service_test.dart"
    group('Token Operations', () {
      test('saveToken should write token to secure storage', () async {
        const token = 'test_token';

        when(mockSecureStorage.write(
          key: 'auth_token',
          value: token,
        )).thenAnswer((_) async {});

        await storageService.saveToken(token);

        verify(mockSecureStorage.write(
          key: 'auth_token',
          value: token,
        )).called(1);
      });

      test('getToken should return token from secure storage', () async {
        const token = 'test_token';

        when(mockSecureStorage.read(key: 'auth_token'))
            .thenAnswer((_) async => token);

        final result = await storageService.getToken();

        expect(result, token);
        verify(mockSecureStorage.read(key: 'auth_token')).called(1);
      });

      test('deleteToken should remove token from secure storage', () async {
        when(mockSecureStorage.delete(key: 'auth_token'))
            .thenAnswer((_) async {});

        await storageService.deleteToken();

        verify(mockSecureStorage.delete(key: 'auth_token')).called(1);
      });
    });
```


3. **Credentials Operations**

```dart title="test/storage_service_test.dart"
    group('Credentials Operations', () {
      test('saveCredentials should write email and password to secure storage',
          () async {
        const email = 'test@example.com';
        const password = 'password123';

        when(mockSecureStorage.write(
          key: 'user_email',
          value: email,
        )).thenAnswer((_) async {});

        when(mockSecureStorage.write(
          key: 'user_password',
          value: password,
        )).thenAnswer((_) async {});

        await storageService.saveCredentials(email, password);

        verify(mockSecureStorage.write(
          key: 'user_email',
          value: email,
        )).called(1);
        verify(mockSecureStorage.write(
          key: 'user_password',
          value: password,
        )).called(1);
      });

      test('getCredentials should return null values when storage throws error',
          () async {
        when(mockSecureStorage.read(key: anyNamed('key')))
            .thenThrow(Exception('Storage error'));

        final result = await storageService.getCredentials();

        expect(result, {'email': null, 'password': null});
      });

      test('deleteCredentials should remove credentials from secure storage',
          () async {
        when(mockSecureStorage.delete(key: 'user_email'))
            .thenAnswer((_) async {});
        when(mockSecureStorage.delete(key: 'user_password'))
            .thenAnswer((_) async {});

        await storageService.deleteCredentials();

        verify(mockSecureStorage.delete(key: 'user_email')).called(1);
        verify(mockSecureStorage.delete(key: 'user_password')).called(1);
      });
    });
```


4. **Error Handling**

```dart title="test/storage_service_test.dart"
    group('Error Handling', () {
      test('getToken should return null when storage throws error', () async {
        when(mockSecureStorage.read(key: 'auth_token'))
            .thenThrow(Exception('Storage error'));

        final result = await storageService.getToken();

        expect(result, null);
      });

      test('getCredentials should return null values when storage throws error',
          () async {
        when(mockSecureStorage.read(key: anyNamed('key')))
            .thenThrow(Exception('Storage error'));

        final result = await storageService.getCredentials();

        expect(result, {'email': null, 'password': null});
      });
    });
```


This comprehensive guide covers the essential aspects of using Mockito and Build Runner in our Flutter testing infrastructure. The examples are taken directly from our codebase, demonstrating real-world usage and best practices.

Remember to run `flutter pub run build_runner build` after making changes to files with `@GenerateMocks` annotations, and consider using watch mode during development for automatic regeneration of mock classes.
