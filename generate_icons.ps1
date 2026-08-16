## generate_icons.ps1  — produce Android launcher assets from a single master icon
## Run: pwsh -File generate_icons.ps1

Add-Type -AssemblyName System.Drawing

$root      = $PSScriptRoot
$masterImg = Get-ChildItem "$root\*.jpg","$root\assets\*.png","$root\assets\*.jpg" -ErrorAction SilentlyContinue |
             Where-Object { $_.Name -match "app_icon_master|logo" } |
             Sort-Object LastWriteTime -Descending | Select-Object -First 1
             
# Fallback: check the generated artifact image
if (-not $masterImg) {
    $masterImg = Get-ChildItem "C:\Users\Shiv Kumar\.gemini\antigravity-ide\brain\6d02becc-6537-4bb3-b996-800f52f3d5f6\app_icon_master*.jpg" -ErrorAction SilentlyContinue |
                 Sort-Object LastWriteTime -Descending | Select-Object -First 1
}

if (-not $masterImg) { Write-Error "No master icon found"; exit 1 }
Write-Host "Using master icon: $($masterImg.FullName)"

$src = [System.Drawing.Image]::FromFile($masterImg.FullName)

function Resize($img, [int]$w, [int]$h, $bgColor, [float]$ratio) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $bmp.SetResolution(72, 72)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.SmoothingMode     = 'HighQuality'
    $g.PixelOffsetMode   = 'HighQuality'
    $g.CompositingQuality = 'HighQuality'
    if ($bgColor) {
        $g.Clear($bgColor)
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }
    $logoW = [int]($w * $ratio)
    $logoH = [int]($h * $ratio)
    $x = [int](($w - $logoW) / 2)
    $y = [int](($h - $logoH) / 2)
    $g.DrawImage($img, $x, $y, $logoW, $logoH)
    $g.Dispose()
    return $bmp
}

function SavePng($bmp, $path) {
    $dir = Split-Path $path
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "  -> $path"
}

$resDir = "$root\android\app\src\main\res"
$bg = [System.Drawing.ColorTranslator]::FromHtml("#bfe3f5")

# --- Adaptive foreground (62% safe zone, transparent bg) ---
$adaptiveSizes = @(
    @{ dir="mipmap-mdpi";    s=108 },
    @{ dir="mipmap-hdpi";    s=162 },
    @{ dir="mipmap-xhdpi";   s=216 },
    @{ dir="mipmap-xxhdpi";  s=324 },
    @{ dir="mipmap-xxxhdpi"; s=432 }
)
Write-Host "`nAdaptive foreground icons (62% safe zone):"
foreach ($sz in $adaptiveSizes) {
    $bmp = Resize $src $sz.s $sz.s $null 0.62
    SavePng $bmp "$resDir\$($sz.dir)\ic_launcher_foreground.png"
}

# --- Legacy launcher icons (82% with bg) ---
$legacySizes = @(
    @{ dir="mipmap-mdpi";    s=48  },
    @{ dir="mipmap-hdpi";    s=72  },
    @{ dir="mipmap-xhdpi";   s=96  },
    @{ dir="mipmap-xxhdpi";  s=144 },
    @{ dir="mipmap-xxxhdpi"; s=192 }
)
Write-Host "`nLegacy launcher icons (82%):"
foreach ($sz in $legacySizes) {
    $bmp = Resize $src $sz.s $sz.s $bg 0.82
    SavePng $bmp "$resDir\$($sz.dir)\ic_launcher.png"
    $round = Resize $src $sz.s $sz.s $bg 0.82
    SavePng $round "$resDir\$($sz.dir)\ic_launcher_round.png"
}

# --- Splash screens (38% centered logo on bg) ---
$splashSizes = @(
    @{ dir="drawable";          w=480;  h=800  },
    @{ dir="drawable-land-hdpi";    w=800;  h=480  },
    @{ dir="drawable-land-mdpi";    w=480;  h=320  },
    @{ dir="drawable-land-xhdpi";   w=1280; h=720  },
    @{ dir="drawable-land-xxhdpi";  w=1600; h=960  },
    @{ dir="drawable-land-xxxhdpi"; w=1920; h=1280 },
    @{ dir="drawable-port-hdpi";    w=480;  h=800  },
    @{ dir="drawable-port-mdpi";    w=320;  h=480  },
    @{ dir="drawable-port-xhdpi";   w=720;  h=1280 },
    @{ dir="drawable-port-xxhdpi";  w=960;  h=1600 },
    @{ dir="drawable-port-xxxhdpi"; w=1280; h=1920 }
)
Write-Host "`nSplash screens (38% centered):"
foreach ($sz in $splashSizes) {
    $minDim = [Math]::Min($sz.w, $sz.h)
    $logoSize = [int]($minDim * 0.38)
    $bmp = New-Object System.Drawing.Bitmap $sz.w, $sz.h
    $bmp.SetResolution(72, 72)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.SmoothingMode = 'HighQuality'
    $g.Clear($bg)
    $x = [int](($sz.w - $logoSize) / 2)
    $y = [int](($sz.h - $logoSize) / 2)
    $g.DrawImage($src, $x, $y, $logoSize, $logoSize)
    $g.Dispose()
    SavePng $bmp "$resDir\$($sz.dir)\splash.png"
}

# --- In-app mascot ---
Write-Host "`nIn-app mascot:"
$mascot = Resize $src 512 512 $null 0.90
SavePng $mascot "$root\src\assets\mascot.png"

# --- Public assets ---
Write-Host "`nPublic assets:"
$logo = Resize $src 512 512 $null 0.90
SavePng $logo "$root\assets\logo.png"
$appIcon = Resize $src 512 512 $null 0.90
SavePng $appIcon "$root\assets\app-icon.png"

# --- Favicon (32x32) ---
$fav = Resize $src 32 32 $null 0.90
SavePng $fav "$root\public\favicon.png"

$src.Dispose()
Write-Host "`nDone! All icons generated."
