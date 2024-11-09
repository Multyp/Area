import 'package:area/src/features/auth/classic.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:area/src/services/storage_service.dart';
import 'package:area/src/widgets/oauth_buttons.dart';
import 'package:area/src/widgets/login_form.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LoginView extends StatefulWidget {
  static const routeName = '/login';

  const LoginView({super.key});

  @override
  LoginViewState createState() => LoginViewState();
}

class LoginViewState extends State<LoginView>
    with SingleTickerProviderStateMixin {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset("assets/images/background.jpg", fit: BoxFit.cover),
          Container(color: Colors.black.withOpacity(0.6)),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: FadeTransition(
                    opacity: _fadeAnimation,
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
                        LoginForm(onLogin: _login),
                        const SizedBox(height: 20.0),
                        Text(
                          AppLocalizations.of(context)!.orLoginWith,
                          style: GoogleFonts.poppins(
                            color: Colors.white70,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 20.0),
                        OAuthButtons(onTokenReceived: _handleTokenReceived),
                      ],
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

  Future<void> _login(String email, String password) async {
    try {
      final data = await AuthService().login(email, password);
      await _storageService.saveToken(data['token']);
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    } catch (error) {
      if (kDebugMode) {
        print('Login error: $error');
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              AppLocalizations.of(context)!.loginFailed(
                AppLocalizations.of(context)!.invalidCredentials,
              ),
              style: const TextStyle(color: Colors.white),
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _handleTokenReceived(String token) async {
    await _storageService.saveToken(token);
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/home');
    }
  }
}
