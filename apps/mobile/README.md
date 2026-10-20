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

Re-run after the Phase 1 brand assets landed (same commands, measured 2026-10-20):
`No issues found!`, `00:04 +7: All tests passed!`, build succeeded, and `aapt list` on the new APK
shows all 24 generated icon resources — five density buckets × four files, plus
`mipmap-anydpi-v26/ic_launcher.xml`, `ic_launcher_round.xml`, `drawable-v21/launch_background.xml`
and `drawable-nodpi/splash_logo.png`. `badging` reports
`icon='res/mipmap-anydpi-v26/ic_launcher.xml'`.

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

## Brand marks are generated, never hand-placed

Every launcher icon, iOS app icon and splash asset in this app is rendered by
`../../tools/make-icons.ps1` from the `icon` block of `../../packages/tokens/tokens.json`. The
glyph is typeset with the app's own `Cairo` font, so there is no SVG-to-PNG tool to install and no
third-party artwork to license.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/make-icons.ps1   # 43 files
```

Change a colour, gradient stop or glyph ratio in `tokens.json` and re-run — the PNGs and the
Android XML under `res/` are output, so do not edit them directly. The script is ASCII-only
because Windows PowerShell 5.1 mis-parses BOM-less non-ASCII sources; the Arabic glyph is read from
JSON instead.

## Not here yet

Supabase client, auth, real listings, booking submission, payments, the AI assistant, Android
release signing, and iOS builds (this machine is Windows — iOS needs cloud macOS CI, tracked as
Phase 0.7).

The app name is `احجزلي` in `android:label` and `CFBundleDisplayName` (`CFBundleName` stays ASCII —
iOS rejects a non-ASCII bundle name).
