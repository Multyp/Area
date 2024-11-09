import 'package:area/src/views/start/auth/register_view.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:area/src/views/start/auth/login_view.dart';
import 'package:area/src/services/storage_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class WelcomeView extends StatelessWidget {
  const WelcomeView({super.key});

  Future<bool> _checkToken() async {
    final storageService = StorageService();
    final token =
        await storageService.getToken(); // Retrieve token from storage
    return token != null &&
        token.isNotEmpty; // Check if token exists and is valid
  }

  Widget _buildLoginButton(
      IconData icon, String text, Color color, VoidCallback onPressed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: SizedBox(
        width: double.infinity,
        height: 60,
        child: ElevatedButton.icon(
          icon: FaIcon(icon, color: color),
          label: Text(
            text,
            style: GoogleFonts.poppins(
              color: color,
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
          // Welcome Content
          SafeArea(
            child: FutureBuilder<bool>(
              future: _checkToken(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasData && snapshot.data == true) {
                  // Token is valid, redirect to home page
                  WidgetsBinding.instance.addPostFrameCallback((_) {
                    Navigator.of(context).pushReplacementNamed('/home');
                  });
                  return Container(); // Empty container while redirecting
                } else {
                  return _buildWelcomeScreen(context);
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeScreen(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              SvgPicture.asset(
                'assets/images/logo.svg',
                height: 100,
                width: 100,
                color: Colors.white,
              ),
              const SizedBox(height: 40.0),
              // Login Button
              _buildLoginButton(
                FontAwesomeIcons.rightToBracket,
                AppLocalizations.of(context)!.login,
                Colors.black,
                () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const LoginView(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 20.0),
              // Register Button
              _buildLoginButton(
                FontAwesomeIcons.userPlus,
                AppLocalizations.of(context)!.register,
                Colors.black,
                () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const RegisterView(),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
