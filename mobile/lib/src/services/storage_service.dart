import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {
  // Instance of FlutterSecureStorage for secure data management
  final FlutterSecureStorage _secureStorage;

  StorageService({FlutterSecureStorage? storage})
      : _secureStorage = storage ?? const FlutterSecureStorage();

  // Keys for secure storage
  static const String _tokenKey = 'auth_token';
  static const String _emailKey = 'user_email';
  static const String _passwordKey = 'user_password';

  /// Saves the authentication token securely.
  ///
  /// This method stores the provided [token] under a predefined key.
  /// If an error occurs, it is caught and logged for debugging purposes.
  Future<void> saveToken(String token) async {
    try {
      await _secureStorage.write(key: _tokenKey, value: token);
    } catch (e) {
      // TODO : Handle failed to save
    }
  }

  /// Retrieves the authentication token from secure storage.
  ///
  /// Returns the token if available, otherwise returns null.
  Future<String?> getToken() async {
    try {
      return await _secureStorage.read(key: _tokenKey);
    } catch (e) {
      return null;
    }
  }

  /// Deletes the authentication token from secure storage.
  ///
  /// Logs an error message if the deletion fails.
  Future<void> deleteToken() async {
    try {
      await _secureStorage.delete(key: _tokenKey);
    } catch (e) {
      // TODO : Handle failed to delete
    }
  }

  /// Saves the user credentials securely.
  ///
  /// Stores the provided [email] and [password] in secure storage.
  Future<void> saveCredentials(String email, String password) async {
    try {
      await _secureStorage.write(key: _emailKey, value: email);
      await _secureStorage.write(key: _passwordKey, value: password);
    } catch (e) {
      // TODO : Handle failed to save
    }
  }

  /// Retrieves the user credentials from secure storage.
  ///
  /// Returns a map containing 'email' and 'password'. If credentials
  /// are not found, the corresponding values will be null.
  Future<Map<String, String?>> getCredentials() async {
    try {
      String? email = await _secureStorage.read(key: _emailKey);
      String? password = await _secureStorage.read(key: _passwordKey);
      return {'email': email, 'password': password};
    } catch (e) {
      return {'email': null, 'password': null};
    }
  }

  /// Deletes the user credentials from secure storage.
  ///
  /// Removes both the stored email and password. Logs an error if deletion fails.
  Future<void> deleteCredentials() async {
    try {
      await _secureStorage.delete(key: _emailKey);
      await _secureStorage.delete(key: _passwordKey);
    } catch (e) {
      // TODO : Handle failed to delete
    }
  }

  /// Logs the user out by deleting both the authentication token and user credentials.
  ///
  /// Calls [deleteToken] and [deleteCredentials] sequentially to ensure all sensitive
  /// information is removed from secure storage. Errors during this process are logged.
  Future<void> logout() async {
    try {
      await deleteToken();
      await deleteCredentials();
    } catch (e) {
      // TODO : Handle logout failed
    }
  }
}
