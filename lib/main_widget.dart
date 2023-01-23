import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart';
import 'package:ota_flutter/localizations/remote_localization.dart';
import 'package:ota_flutter/localizations/remote_localization_delegate.dart';

class MainApp extends StatelessWidget {
  const MainApp({super.key, required this.remoteLocalizations});

  final RemoteLocalizations remoteLocalizations;

  @override
  Widget build(BuildContext context) {
    Intl.defaultLocale = 'en_US';

    return MaterialApp(
      localizationsDelegates: [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        RemoteLocalizationsDelegate(remoteLocalizations),
      ],
      home: const HelloUserWidget(),
    );
  }
}

class HelloUserWidget extends StatelessWidget {
  const HelloUserWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final localizations = RemoteLocalizations.of(context);

    return Scaffold(
      body: Center(
        child: Text(localizations.getHelloUser('King Murat')),
      ),
    );
  }
}
