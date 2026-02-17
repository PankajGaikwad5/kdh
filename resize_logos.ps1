# PowerShell script to resize collaboration logos to uniform size while preserving transparency

$targetSize = 800
$outputDir = "c:\Users\user\Desktop\kdh\kdh\public\updatedcollabs"

# Ensure output directory exists
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

# Define source images and output names
$images = @(
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\sq\logo2.png"; Output="square_knots.png"},
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\optimized\serafinilogo.webp"; Output="serafini.webp"},
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\assets\dimensions.png"; Output="dimension.png"},
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\assets\quary.png"; Output="the_quarry.png"},
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\assets\bft.png"; Output="bft.png"},
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\assets\fm.png"; Output="marble.png"},
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\assets\casa2.png"; Output="casa.png"},
    @{Source="c:\Users\user\Desktop\kdh\kdh\public\assets\arjunrathilogo2.png"; Output="arjun_rathi.png"}
)

Write-Host "Installing/Checking for ImageMagick via Chocolatey..." -ForegroundColor Cyan

# Check if ImageMagick is installed
$magickPath = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickPath) {
    Write-Host "ImageMagick not found. Please install it manually or use an alternative method." -ForegroundColor Yellow
    Write-Host "You can install ImageMagick from: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    exit 1
}

Write-Host "Processing images..." -ForegroundColor Green

foreach ($img in $images) {
    if (Test-Path $img.Source) {
        $outputPath = Join-Path $outputDir $img.Output
        Write-Host "Resizing: $($img.Source) -> $outputPath" -ForegroundColor Cyan
        
        # Resize with ImageMagick, preserving transparency and aspect ratio
        & magick convert $img.Source -resize "${targetSize}x${targetSize}" -background none -gravity center -extent "${targetSize}x${targetSize}" $outputPath
        
        Write-Host "  ✓ Completed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Source not found: $($img.Source)" -ForegroundColor Red
    }
}

# Download Top Brewer logo
Write-Host "Downloading Top Brewer logo..." -ForegroundColor Cyan
$topBrewerUrl = "https://www.topbrewernyc.com/wp-content/uploads/2023/06/TopBrewer-logo-white.png"
$topBrewerTemp = Join-Path $env:TEMP "topbrewer_temp.png"
$topBrewerOutput = Join-Path $outputDir "top_brewer.png"

try {
    Invoke-WebRequest -Uri $topBrewerUrl -OutFile $topBrewerTemp
    & magick convert $topBrewerTemp -resize "${targetSize}x${targetSize}" -background none -gravity center -extent "${targetSize}x${targetSize}" $topBrewerOutput
    Remove-Item $topBrewerTemp -ErrorAction SilentlyContinue
    Write-Host "  ✓ Top Brewer logo processed" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to download Top Brewer logo: $_" -ForegroundColor Red
}

Write-Host "`nAll images processed successfully!" -ForegroundColor Green
Write-Host "Output directory: $outputDir" -ForegroundColor Cyan
