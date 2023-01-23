import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sprintf/sprintf.dart';

class RemoteLocalizations {
  Map<String, dynamic> translations = <String, dynamic>{};

  static RemoteLocalizations of(BuildContext context) {
    return Localizations.of<RemoteLocalizations>(context, RemoteLocalizations)!;
  }

  // ignore: use_setters_to_change_properties
  void setTranslations(Map<String, dynamic> translations) {
    this.translations = translations;
  }

  Future<bool> load() async {
    return true;
  }

  String get time => translate('time');
  String getHelloUser(String userName) =>
      translate('helloUser').tryFormat(<dynamic>[userName]);

  String translate(String key) {
    return translations[key] ?? '__${key}__';
  }
}

extension StringExtension on String {
  String tryFormat(List<dynamic> args) {
    try {
      return sprintf(this, args);
    } catch (e) {
      print('LOG ME');
      return '';
    }
  }
}
