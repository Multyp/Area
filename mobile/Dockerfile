FROM ubuntu:latest

# Mise à jour du système et installation des dépendances
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl git unzip xz-utils zip libglu1-mesa wget software-properties-common && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Installation de Java 17
RUN add-apt-repository ppa:openjdk-r/ppa && \
    apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Définition de JAVA_HOME
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64
ENV PATH $PATH:$JAVA_HOME/bin

# Installation du SDK Android
ENV ANDROID_HOME /usr/local/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

RUN mkdir -p ${ANDROID_HOME} && cd ${ANDROID_HOME} && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip commandlinetools-linux-*_latest.zip && \
    rm commandlinetools-linux-*_latest.zip && \
    mkdir -p cmdline-tools/latest && \
    mv cmdline-tools/* cmdline-tools/latest/ || true && \
    rm -rf cmdline-tools/latest/cmdline-tools

# Ajout du chemin vers sdkmanager dans le PATH
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin

# Installation des composants Android nécessaires
RUN yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses && \
    ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"

# Installation de Flutter
ENV FLUTTER_HOME=/flutter
ENV PATH=$PATH:$FLUTTER_HOME/bin

RUN git clone https://github.com/flutter/flutter.git $FLUTTER_HOME -b stable

# Vérification de l'installation de Flutter et préchauffage
RUN flutter doctor -v && \
    flutter precache

# Configuration de Flutter pour Android
RUN flutter config --no-analytics && \
    flutter config --android-sdk $ANDROID_HOME

WORKDIR /app

# Copie des fichiers du projet
COPY . .

# Nettoyage et installation des dépendances
RUN flutter clean
RUN flutter pub get

# Construction de l'APK
RUN flutter build apk --release

# Création du répertoire de destination
RUN mkdir -p /app/build/app/outputs/flutter-apk

# Copie de l'APK dans le répertoire de destination
CMD ["cp", "/app/build/app/outputs/flutter-apk/app-release.apk", "/app/public/mobile/client.apk"]
