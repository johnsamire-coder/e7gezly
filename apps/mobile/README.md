# apps/mobile — احجزلي customer app

**This is the customer product.** Flutter for Android and iOS, Arabic-first, full RTL.
The web app in `../web` is the provider/admin portal — never a substitute for this app.

## Run

```bash
cd apps/mobile
flutter pub get
flutter devices            # pick a device or emulator ID
flutter run -d <deviceId>
```

Verification commands used in Phase 0:

```bash
flutter analyze     # No issues found
flutter test        # 7/7 passed
flutter build apk --debug   # build/app/outputs/flutter-apk/app-debug.apk — verified with aapt:
                            # application-label:'احجزلي', minSdk 24
```

## What is in place (Phase 0.4)

| Piece | File |
| --- | --- |
| Brand colors, radii, spacing, fonts | `lib/core/tokens.dart` (mirrors `packages/tokens`) |
| EGP + Arabic date formatting | `lib/core/format.dart` |
| Launch verticals (taxonomy labels only) | `lib/core/categories.dart` |
| Material 3 RTL theme | `lib/theme.dart` |
| Router skeleton | `lib/router.dart` |
| Home: wordmark, «عايز تحجز إيه؟» field, category cards | `lib/screens/home_screen.dart` |
| Search: working filter state, no results yet | `lib/screens/search_screen.dart` |
| Honest "not built yet" screen | `lib/screens/placeholder_screen.dart` |
| "No real listings yet" banner | `lib/widgets/data_offline_banner.dart` |

Routes live now: `/`, `/search`, `/listing`, `/booking`, `/login`, `/provider`.
`/listing`, `/booking`, `/login` and `/provider` render `PlaceholderScreen`, which states in
Arabic that the screen is not built and why. None of them performs an action that would pretend
to book, confirm, or sign in.

## Formatting decision

`intl` locale **`ar`**, not `ar_EG`: measured output is `1,200 ج.م` with `ar` and
`١٬٢٠٠ ج.م` with `ar_EG`. The brand tokens require Latin digits, so `ar` it is. If intl's data
ever changes, `test/app_test.dart` fails instead of silently switching digit systems.

## Fonts

`Cairo` (display, variable — heavier weights requested through `FontVariation`) and
`IBM Plex Sans Arabic` (text, static 400/500/600/700) live in `assets/fonts/` under the SIL Open
Font License, with `OFL-*.txt` attribution files beside them. No third-party logos or brand marks
are used anywhere; the wordmark is typeset text.

## Not here yet

Supabase client, auth, real listings, booking submission, payments, the AI assistant, Android
release signing, and iOS builds (this machine is Windows — iOS needs cloud macOS CI, tracked as
Phase 0.7).

The launcher icons in `android/app/src/main/res/mipmap-*/ic_launcher.png` and
`ios/Runner/Assets.xcassets/AppIcon.appiconset` are still the **stock Flutter template files**, not
ours. They must be replaced with an original mark before any release build — the project brief
rules out shipping unverified logos. The app name itself is set correctly: `احجزلي` in
`android:label` and `CFBundleDisplayName`.
