import 'package:area/src/features/auth/google.dart';
import 'package:area/src/services/storage_service.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:area/src/features/auth/github.dart';
import 'package:area/src/features/auth/microsoft.dart';
import 'package:area/src/features/auth/discord.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class RegisterView extends StatefulWidget {
  static const routeName = '/register';

  const RegisterView({super.key});

  @override
  RegisterViewState createState() => RegisterViewState();
}

class RegisterViewState extends State<RegisterView>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';
  String _confirmPassword = '';
  bool _isPasswordVisible = false;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  final StorageService _storageService = StorageService();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _fadeAnimation =
        Tween<double>(begin: 0.0, end: 1.0).animate(_animationController);
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  // Email validation using regex
  String? _validateEmail(String? value) {
    const String emailPattern =
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
    if (value == null || value.isEmpty) {
      return AppLocalizations.of(context)!.pleaseEnterEmail;
    } else if (!RegExp(emailPattern).hasMatch(value)) {
      return AppLocalizations.of(context)!.pleaseEnterValidEmail;
    }
    return null;
  }

  // Password match validation
  String? _validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return AppLocalizations.of(context)!.pleaseConfirmPassword;
    } else if (value != _password) {
      return AppLocalizations.of(context)!.passwordsDoNotMatch;
    }
    return null;
  }

  void _register() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();

      if (_password != _confirmPassword) {
        _showErrorSnackBar(AppLocalizations.of(context)!.passwordsDoNotMatch);
        return;
      }

      const url = 'https://rooters-area.com/api/auth/register';
      final Map<String, String> headers = {'Content-Type': 'application/json'};
      final Map<String, String> body = {
        'email': _email,
        'password': _password,
      };

      try {
        final response = await http.post(
          Uri.parse(url),
          headers: headers,
          body: json.encode(body),
        );

        if (response.statusCode == 201) {
          final data = jsonDecode(response.body);
          await StorageService().saveToken(data['token']);
          _navigateToHome();
        } else {
          if (!mounted) return;
          _showErrorSnackBar(AppLocalizations.of(context)!
              .registrationFailed(json.decode(response.body)['message']));
        }
      } catch (e) {
        if (!mounted) return;
        _showErrorSnackBar('An error occurred: $e');
      }
    }
  }

  void _navigateToHome() {
    Navigator.of(context).pushReplacementNamed('/home');
  }

  void _showErrorSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Widget _buildRegisterButton(
      IconData icon, String text, Color color, VoidCallback onPressed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: SizedBox(
        width: double.infinity,
        height: 60,
        child: ElevatedButton.icon(
          icon: FaIcon(icon, color: Colors.black),
          label: Text(
            text,
            style: GoogleFonts.poppins(
              color: Colors.black,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            backgroundColor: Colors.white,
          ),
          onPressed: onPressed,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background Image
          Image.asset(
            "assets/images/background.jpg",
            fit: BoxFit.cover,
          ),
          // Dark overlay
          Container(
            color: Colors.black.withOpacity(0.6),
          ),
          // Register Form
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: FadeTransition(
                    opacity: _fadeAnimation,
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SvgPicture.asset(
                            'assets/images/logo.svg',
                            height: 100,
                            width: 100,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 40.0),
                          // Email field with regex validation
                          TextFormField(
                            decoration: InputDecoration(
                              labelText: 'Email',
                              prefixIcon: const Icon(Icons.email,
                                  color: Colors.white70),
                              labelStyle:
                                  GoogleFonts.poppins(color: Colors.white70),
                            ),
                            style: GoogleFonts.poppins(color: Colors.white),
                            keyboardType: TextInputType.emailAddress,
                            validator: _validateEmail,
                            onSaved: (value) {
                              _email = value!;
                            },
                          ),
                          const SizedBox(height: 20.0),
                          // Password field
                          TextFormField(
                            decoration: InputDecoration(
                              labelText: AppLocalizations.of(context)!.password,
                              prefixIcon:
                                  const Icon(Icons.lock, color: Colors.white70),
                              labelStyle:
                                  GoogleFonts.poppins(color: Colors.white70),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _isPasswordVisible
                                      ? Icons.visibility
                                      : Icons.visibility_off,
                                  color: Colors.white70,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _isPasswordVisible = !_isPasswordVisible;
                                  });
                                },
                              ),
                            ),
                            style: GoogleFonts.poppins(color: Colors.white),
                            obscureText: !_isPasswordVisible,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return AppLocalizations.of(context)!
                                    .pleaseEnterPassword;
                              }
                              return null;
                            },
                            onSaved: (value) {
                              _password = value!;
                            },
                          ),
                          const SizedBox(height: 20.0),
                          // Confirm password field with validation
                          TextFormField(
                            decoration: InputDecoration(
                              labelText:
                                  AppLocalizations.of(context)!.confirmPassword,
                              prefixIcon:
                                  const Icon(Icons.lock, color: Colors.white70),
                              labelStyle:
                                  GoogleFonts.poppins(color: Colors.white70),
                            ),
                            style: GoogleFonts.poppins(color: Colors.white),
                            obscureText: true,
                            validator: _validateConfirmPassword,
                            onSaved: (value) {
                              _confirmPassword = value!;
                            },
                          ),
                          const SizedBox(height: 40.0),
                          _buildRegisterButton(
                            Icons.person_add,
                            AppLocalizations.of(context)!.register,
                            Colors.green,
                            () {
                              _formKey.currentState!.save();
                              if (_formKey.currentState!.validate()) {
                                _register();
                              }
                            },
                          ),
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            style: TextButton.styleFrom(
                              minimumSize: const Size(double.infinity, 60),
                              backgroundColor: Colors.white.withOpacity(0.2),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                                side: const BorderSide(
                                    color: Colors.white, width: 2),
                              ),
                            ),
                            child: Text(
                              AppLocalizations.of(context)!.back,
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20.0),
                          Text(
                            AppLocalizations.of(context)!.orRegisterWith,
                            style: GoogleFonts.poppins(
                              color: Colors.white70,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 20.0),
                          _buildRegisterButton(
                            FontAwesomeIcons.github,
                            AppLocalizations.of(context)!.loginWithGitHub,
                            Colors.black87,
                            () async {
                              await Navigator.of(context).push<String>(
                                MaterialPageRoute(
                                  builder: (context) => GitHubOAuthWebView(
                                    onTokenReceived: (token) async {
                                      await _storageService.saveToken(token);
                                      _navigateToHome();
                                    },
                                  ),
                                ),
                              );
                            },
                          ),
                          _buildRegisterButton(
                            FontAwesomeIcons.google,
                            AppLocalizations.of(context)!.loginWithGoogle,
                            Colors.red,
                            () async {
                              await Navigator.of(context).push<String>(
                                MaterialPageRoute(
                                  builder: (context) => GoogleOAuthWebView(
                                    onTokenReceived: (token) async {
                                      await _storageService.saveToken(token);
                                      _navigateToHome();
                                    },
                                  ),
                                ),
                              );
                            },
                          ),
                          _buildRegisterButton(
                            FontAwesomeIcons.microsoft,
                            AppLocalizations.of(context)!.loginWithMicrosoft,
                            Colors.blue,
                            () async {
                              await Navigator.of(context).push<String>(
                                MaterialPageRoute(
                                  builder: (context) => MicrosoftOAuthWebView(
                                    onTokenReceived: (token) async {
                                      await _storageService.saveToken(token);
                                      _navigateToHome();
                                    },
                                  ),
                                ),
                              );
                            },
                          ),
                          _buildRegisterButton(
                            FontAwesomeIcons.discord,
                            AppLocalizations.of(context)!.loginWithDiscord,
                            const Color(0xFF7289DA),
                            () async {
                              await Navigator.of(context).push<String>(
                                MaterialPageRoute(
                                  builder: (context) => DiscordOAuthWebView(
                                    onTokenReceived: (token) async {
                                      await _storageService.saveToken(token);
                                      _navigateToHome();
                                    },
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
