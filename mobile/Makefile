# Flutter binary path
FLUTTER_BIN := flutter
DART_BIN := dart

# Web server port
WEB_PORT := 5555

# Main Dart file for the application
APK_TARGET := lib/main.dart

# Default target: run web server and build APK
.PHONY: all
all: run-web build-apk

# Run Flutter application on a connected device or emulator
.PHONY: run
run:
	@echo "Running Flutter application..."
	$(FLUTTER_BIN) run -t $(APK_TARGET)

run-release:
	@echo "Running Flutter application..."
	$(FLUTTER_BIN) run -t $(APK_TARGET) --release

# Start Flutter web server
.PHONY: run-web
run-web:
	@echo "Starting Flutter web server on port $(WEB_PORT)..."
	$(FLUTTER_BIN) run -d web-server --web-port $(WEB_PORT) -t $(APK_TARGET)

# Generate app icons
.PHONY: generate-icons
gen-icons:
	@echo "Generating app icons..."
	$(DART_BIN) run flutter_launcher_icons

# Build APK with ABI splits, including icon generation
.PHONY: build-apk
build-apk: gen-icons
	@echo "Building APK with ABI splits..."
	$(FLUTTER_BIN) build apk --split-per-abi

# Clean Flutter build artifacts
.PHONY: clean
clean:
	@echo "Cleaning Flutter build artifacts..."
	$(FLUTTER_BIN) clean

# Analyze Dart code for errors and warnings
.PHONY: analyze
analyze:
	@echo "Analyzing Dart code..."
	$(FLUTTER_BIN) analyze

# Run Flutter tests
.PHONY: test
test:
	@echo "Running Flutter tests..."
	$(FLUTTER_BIN) test

# Display help information
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make run           - Run Flutter application on a connected device or emulator"
	@echo "  make run-web       - Start Flutter web server on port $(WEB_PORT)"
	@echo "  make gen-icons 	- Generate app icons using flutter_launcher_icons"
	@echo "  make build-apk     - Build APK with ABI splits (includes icon generation)"
	@echo "  make clean         - Remove Flutter build artifacts"
	@echo "  make analyze       - Analyze Dart code for errors and warnings"
	@echo "  make test          - Run Flutter tests"
	@echo "  make help          - Display this help message"
