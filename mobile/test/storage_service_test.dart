import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:area/src/services/storage_service.dart';

// Generate mock class
@GenerateMocks([FlutterSecureStorage])
import 'storage_service_test.mocks.dart';

void main() {
  late StorageService storageService;
  late MockFlutterSecureStorage mockSecureStorage;

  setUp(() {
    mockSecureStorage = MockFlutterSecureStorage();
    // Inject the mock into StorageService
    storageService = StorageService(storage: mockSecureStorage);
  });

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

    group('Logout Operation', () {
      test('logout should delete both token and credentials', () async {
        when(mockSecureStorage.delete(key: anyNamed('key')))
            .thenAnswer((_) async {});

        await storageService.logout();

        verify(mockSecureStorage.delete(key: 'auth_token')).called(1);
        verify(mockSecureStorage.delete(key: 'user_email')).called(1);
        verify(mockSecureStorage.delete(key: 'user_password')).called(1);
      });
    });

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
  });
}
