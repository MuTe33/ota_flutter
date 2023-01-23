import 'dart:async';

import 'package:flutter/material.dart';
import 'package:ota_flutter/localizations/remote_localization.dart';

/// We need to provide the loaded locales here because otherwise, the
/// [Localizations] Widget of flutter is going to just render a [Container]
/// widget for as long as the resolving of the localizations takes. This is bad
/// because we want to display our splash screen and therefore could only rely
/// on futures that quickly load  from the local filesystem for example.
class RemoteLocalizationsDelegate
    extends LocalizationsDelegate<RemoteLocalizations> {
  RemoteLocalizationsDelegate(this.translations);

  final RemoteLocalizations translations;

  @override
  bool isSupported(Locale locale) => true;

  @override
  Future<RemoteLocalizations> load(Locale locale) async => translations;

  @override
  bool shouldReload(LocalizationsDelegate<RemoteLocalizations> old) => false;
}
