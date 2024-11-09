import 'package:area/src/services/storage_service.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:area/src/views/start/welcome_view.dart';

class LanguageSelectionView extends StatelessWidget {
  final Function(String) onLanguageChanged;

  const LanguageSelectionView({
    super.key,
    required this.onLanguageChanged,
  });

  Future<bool> _checkToken() async {
    final storageService = StorageService();
    final token =
        await storageService.getToken(); // Retrieve token from storage
    return token != null &&
        token.isNotEmpty; // Check if token exists and is valid
  }

  void _selectLanguage(BuildContext context, String languageCode) async {
    onLanguageChanged(languageCode);

    // Save selected language
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('languageCode', languageCode);

    // Navigate to welcome view
    if (context.mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const WelcomeView()),
      );
    }
  }

  Widget _buildFlagIcon(String countryCode) {
    return Container(
      width: 30,
      height: 30,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: SvgPicture.asset(
        'assets/icon/lang/$countryCode.svg',
        fit: BoxFit.cover,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            "assets/images/background.jpg",
            fit: BoxFit.cover,
          ),
          Container(
            color: Colors.black.withOpacity(0.6),
          ),
          // Add FutureBuilder here
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
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SvgPicture.asset(
                            'assets/images/logo.svg',
                            height: 100,
                            width: 100,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 48),
                          Text(
                            "Choose your language\nChoisissez votre langue",
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            "You can change this later in settings\nVous pourrez modifier cela plus tard dans les paramètres",
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: Colors.white70,
                            ),
                          ),
                          const SizedBox(height: 48),
                          _buildLanguageButton(
                            context,
                            "English",
                            "en",
                            _buildFlagIcon('en'),
                          ),
                          const SizedBox(height: 16),
                          _buildLanguageButton(
                            context,
                            "Français",
                            "fr",
                            _buildFlagIcon('fr'),
                          ),
                        ],
                      ),
                    ),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageButton(
    BuildContext context,
    String language,
    String languageCode,
    Widget flagIcon,
  ) {
    return SizedBox(
      width: double.infinity,
      height: 60,
      child: ElevatedButton(
        onPressed: () => _selectLanguage(context, languageCode),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            flagIcon,
            const SizedBox(width: 12),
            Text(
              language,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
