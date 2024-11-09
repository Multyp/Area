import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LoginForm extends StatefulWidget {
  final Function(String email, String password) onLogin;

  const LoginForm({super.key, required this.onLogin});

  @override
  LoginFormState createState() => LoginFormState();
}

class LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';
  bool _isLoading = false;
  bool _isPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // Email field
          TextFormField(
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.email,
              prefixIcon: const Icon(Icons.email, color: Colors.white70),
              labelStyle: GoogleFonts.poppins(color: Colors.white70),
            ),
            style: GoogleFonts.poppins(color: Colors.white),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return AppLocalizations.of(context)!.pleaseEnterEmail;
              }
              return null;
            },
            onSaved: (value) {
              _email = value!;
            },
          ),
          const SizedBox(height: 20.0),
          // Password field with show/hide functionality
          TextFormField(
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.password,
              prefixIcon: const Icon(Icons.lock, color: Colors.white70),
              labelStyle: GoogleFonts.poppins(color: Colors.white70),
              suffixIcon: IconButton(
                icon: Icon(
                  _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                  color: Colors.white70,
                ),
                onPressed: () {
                  setState(() {
                    _isPasswordVisible =
                        !_isPasswordVisible; // Toggle visibility
                  });
                },
              ),
            ),
            style: GoogleFonts.poppins(color: Colors.white),
            obscureText: !_isPasswordVisible, // Show or hide password
            validator: (value) {
              if (value == null || value.isEmpty) {
                return AppLocalizations.of(context)!.pleaseEnterPassword;
              }
              return null;
            },
            onSaved: (value) {
              _password = value!;
            },
          ),
          const SizedBox(height: 40.0),
          // Login button
          _isLoading
              ? const CircularProgressIndicator()
              : SizedBox(
                  width: double.infinity,
                  height: 60,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.login, color: Colors.black),
                    label: Text(
                      AppLocalizations.of(context)!.login,
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
                    onPressed: _submitForm,
                  ),
                ),
          const SizedBox(height: 20.0),
          // Back button
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Navigate back
            },
            style: TextButton.styleFrom(
              minimumSize: const Size(double.infinity, 60),
              backgroundColor: Colors.white.withOpacity(0.2),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
                side: const BorderSide(color: Colors.white, width: 2),
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
        ],
      ),
    );
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      _formKey.currentState!.save();
      widget.onLogin(_email, _password).then((_) {
        setState(() {
          _isLoading = false;
        });
      });
    }
  }
}
