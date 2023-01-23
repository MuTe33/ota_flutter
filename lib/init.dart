import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:ota_flutter/localizations/remote_localization.dart';
import 'package:ota_flutter/main.dart';

void main() async {
  final remoteLocalizations = await _initLocalizations();

  runApp(MainApp(remoteLocalizations: remoteLocalizations));
}

Future<RemoteLocalizations> _initLocalizations() async {
  final remoteLocalizations = RemoteLocalizations();
  final firestore = FirebaseFirestore.instance;
  final controller = RemoteLocalizationsController(firestore);

  final remoteTranslationMap = await controller.getRemoteLocalizations();

  remoteLocalizations.setTranslations(remoteTranslationMap);

  return remoteLocalizations;
}

class RemoteLocalizationsController {
  RemoteLocalizationsController(this._firestore);

  final FirebaseFirestore _firestore;

  Future<Map<String, dynamic>> getRemoteLocalizations() async {
    final snapshot =
        await _firestore.collection('app_translation_prod').doc('en').get();

    if (!snapshot.exists || snapshot.data() == null) {
      throw Exception('Translations should not be null');
    }

    return snapshot.data()!;
  }
}
