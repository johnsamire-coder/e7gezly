# Renders every brand mark in the app from packages/tokens/tokens.json.
# The PNGs under apps/mobile are generated output: change the tokens, re-run this, never hand-edit.
# Requires only Windows PowerShell + .NET System.Drawing (no network, no image tooling).
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/make-icons.ps1

#requires -Version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$tokenPath = Join-Path $root "packages/tokens/tokens.json"
$tokens = Get-Content -Raw -Encoding UTF8 $tokenPath | ConvertFrom-Json
$spec = $tokens.icon

function ConvertFrom-Hex([string]$hex) {
    $hex = $hex.TrimStart("#")
    return [System.Drawing.Color]::FromArgb(
        255,
        [Convert]::ToInt32($hex.Substring(0, 2), 16),
        [Convert]::ToInt32($hex.Substring(2, 2), 16),
        [Convert]::ToInt32($hex.Substring(4, 2), 16))
}

$topColor = ConvertFrom-Hex $spec.gradientTop
$bottomColor = ConvertFrom-Hex $spec.gradientBottom
$glyphColor = ConvertFrom-Hex $spec.foreground
$glyph = $spec.glyph

$fontPath = Join-Path $root "apps/mobile/assets/fonts/Cairo-Variable.ttf"
if (-not (Test-Path $fontPath)) { throw "display font missing: $fontPath" }
$privateFonts = New-Object System.Drawing.Text.PrivateFontCollection
$privateFonts.AddFontFile($fontPath)
$fontFamily = $privateFonts.Families[0]

function New-RoundedPath([int]$size, [double]$ratio) {
    $d = [Math]::Max(1, [int]($size * $ratio))
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $d, $d, 180, 90) | Out-Null
    $path.AddArc($size - $d - 1, 0, $d, $d, 270, 90) | Out-Null
    $path.AddArc($size - $d - 1, $size - $d - 1, $d, $d, 0, 90) | Out-Null
    $path.AddArc(0, $size - $d - 1, $d, $d, 90, 90) | Out-Null
    $path.CloseFigure() | Out-Null
    return $path
}

# Mode: full (background + glyph) | background (no glyph) | glyph (transparent + glyph)
# Shape: square | rounded | circle   (ignored when Mode = glyph)
function New-Mark([int]$size, [string]$shape, [string]$mode, [double]$glyphRatio) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    if ($mode -ne "glyph") {
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            (New-Object System.Drawing.Point(0, 0)),
            (New-Object System.Drawing.Point(0, $size)),
            $topColor, $bottomColor)
        if ($shape -eq "square") {
            $g.FillRectangle($brush, 0, 0, $size, $size)
        } elseif ($shape -eq "circle") {
            $g.FillEllipse($brush, 0, 0, $size, $size)
        } else {
            $rp = New-RoundedPath $size ([double]$spec.cornerRatio)
            $g.FillPath($brush, $rp)
            $rp.Dispose()
        }
        $brush.Dispose()
    }

    if ($mode -ne "background") {
        $fmt = New-Object System.Drawing.StringFormat
        $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft
        $fmt.Alignment = [System.Drawing.StringAlignment]::Center
        $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
        $emSize = [single]([Math]::Max(1, $size * $glyphRatio))
        $font = New-Object System.Drawing.Font($fontFamily, $emSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $brush = New-Object System.Drawing.SolidBrush $glyphColor
        $box = New-Object System.Drawing.RectangleF(0, 0, [single]$size, [single]$size)
        $g.DrawString($glyph, $font, $brush, $box, $fmt)
        $brush.Dispose(); $font.Dispose(); $fmt.Dispose()
    }

    $g.Dispose()
    return $bmp
}

$written = New-Object System.Collections.ArrayList

function Save-Mark([int]$size, [string]$shape, [string]$mode, [double]$glyphRatio, [string]$path) {
    $dir = Split-Path -Parent $path
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $bmp = New-Mark $size $shape $mode $glyphRatio
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $written.Add($path) | Out-Null
}

function Save-Text([string]$text, [string]$path) {
    $dir = Split-Path -Parent $path
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    [System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding($false)))
    $written.Add($path) | Out-Null
}

$res = Join-Path $root "apps/mobile/android/app/src/main/res"
$glyphRatio = [double]$spec.glyphRatio

# --- Android: legacy launcher bitmaps + adaptive layers -------------------------
$densities = [ordered]@{ mdpi = 48; hdpi = 72; xhdpi = 96; xxhdpi = 144; xxxhdpi = 192 }
foreach ($dpi in $densities.Keys) {
    $px = $densities[$dpi]
    $dir = Join-Path $res "mipmap-$dpi"
    Save-Mark $px "rounded" "full" $glyphRatio (Join-Path $dir "ic_launcher.png")
    Save-Mark $px "circle" "full" $glyphRatio (Join-Path $dir "ic_launcher_round.png")
    # adaptive canvas is 108dp, so 2.25x the 48dp legacy size
    $adaptive = [int]($px * 2.25)
    Save-Mark $adaptive "square" "background" 0 (Join-Path $dir "ic_launcher_background.png")
    Save-Mark $adaptive "square" "glyph" ([double]$spec.adaptiveGlyphRatio) (Join-Path $dir "ic_launcher_foreground.png")
}

$adaptiveXml = @"
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"@
Save-Text $adaptiveXml (Join-Path $res "mipmap-anydpi-v26/ic_launcher.xml")
Save-Text $adaptiveXml (Join-Path $res "mipmap-anydpi-v26/ic_launcher_round.xml")

# --- Android splash: same gradient, mark centred --------------------------------
# android:angle is in the drawable's own coordinate system, not CSS: 270 = top to bottom.
$splashXml = @"
<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by tools/make-icons.ps1 from packages/tokens/tokens.json. Do not hand-edit. -->
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item>
        <shape android:shape="rectangle">
            <gradient android:type="linear" android:angle="270"
                android:startColor="#FF$($spec.gradientTop.TrimStart('#'))"
                android:endColor="#FF$($spec.gradientBottom.TrimStart('#'))" />
        </shape>
    </item>
    <item>
        <bitmap android:gravity="center" android:src="@drawable/splash_logo" />
    </item>
</layer-list>
"@
Save-Text $splashXml (Join-Path $res "drawable/launch_background.xml")
Save-Text $splashXml (Join-Path $res "drawable-v21/launch_background.xml")

# --- Android + iOS splash mark --------------------------------------------------
Save-Mark 512 "square" "glyph" $glyphRatio (Join-Path $res "drawable-nodpi/splash_logo.png")

$launchDir = Join-Path $root "apps/mobile/ios/Runner/Assets.xcassets/LaunchImage.imageset"
Save-Mark 160 "square" "glyph" $glyphRatio (Join-Path $launchDir "LaunchImage.png")
Save-Mark 320 "square" "glyph" $glyphRatio (Join-Path $launchDir "LaunchImage@2x.png")
Save-Mark 480 "square" "glyph" $glyphRatio (Join-Path $launchDir "LaunchImage@3x.png")

# --- iOS: full-bleed squares, no baked-in rounding ------------------------------
# iOS masks the icon itself; rounded corners or transparency here show up as a
# grey halo in Settings and get the 1024px artwork rejected on upload.
$iosDir = Join-Path $root "apps/mobile/ios/Runner/Assets.xcassets/AppIcon.appiconset"
$iosIcons = [ordered]@{
    "Icon-App-20x20@1x.png"   = 20;   "Icon-App-20x20@2x.png" = 40;  "Icon-App-20x20@3x.png" = 60
    "Icon-App-29x29@1x.png"   = 29;   "Icon-App-29x29@2x.png" = 58;  "Icon-App-29x29@3x.png" = 87
    "Icon-App-40x40@1x.png"   = 40;   "Icon-App-40x40@2x.png" = 80;  "Icon-App-40x40@3x.png" = 120
    "Icon-App-60x60@2x.png"   = 120;  "Icon-App-60x60@3x.png" = 180
    "Icon-App-76x76@1x.png"   = 76;   "Icon-App-76x76@2x.png" = 152
    "Icon-App-83.5x83.5@2x.png" = 167
    "Icon-App-1024x1024@1x.png" = 1024
}
foreach ($name in $iosIcons.Keys) {
    Save-Mark $iosIcons[$name] "square" "full" $glyphRatio (Join-Path $iosDir $name)
}

$privateFonts.Dispose()

$bytes = 0
foreach ($f in $written) { $bytes += (Get-Item $f).Length }
"mark: '$glyph'  $($spec.gradientTop) -> $($spec.gradientBottom) on $($spec.foreground)"
"$($written.Count) files, {0:N0} bytes" -f $bytes
