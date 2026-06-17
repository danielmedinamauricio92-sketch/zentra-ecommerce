param(
  [string]$ImagesDir = "front/public/images",
  [string]$PreloadFile = "back/src/helpers/preLoadProducts.ts",
  [int]$CanvasWidth = 1536,
  [int]$CanvasHeight = 1024,
  [double]$TargetFill = 0.84,
  [int]$Threshold = 245
)

Add-Type -AssemblyName System.Drawing

$source = Get-Content -Raw -Path $PreloadFile
$referenced = [regex]::Matches($source, 'image:\s*"/images/([^"]+)"') |
  ForEach-Object { $_.Groups[1].Value } |
  Sort-Object -Unique

function Get-ContentBounds([System.Drawing.Bitmap]$bitmap, [int]$threshold) {
  $minX = $bitmap.Width
  $minY = $bitmap.Height
  $maxX = 0
  $maxY = 0

  for ($y = 0; $y -lt $bitmap.Height; $y++) {
    for ($x = 0; $x -lt $bitmap.Width; $x++) {
      $pixel = $bitmap.GetPixel($x, $y)
      if (($pixel.R -lt $threshold) -or ($pixel.G -lt $threshold) -or ($pixel.B -lt $threshold)) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -le $minX -or $maxY -le $minY) {
    return $null
  }

  $padX = [Math]::Max(8, [int](($maxX - $minX) * 0.04))
  $padY = [Math]::Max(8, [int](($maxY - $minY) * 0.05))

  $minX = [Math]::Max(0, $minX - $padX)
  $minY = [Math]::Max(0, $minY - $padY)
  $maxX = [Math]::Min($bitmap.Width - 1, $maxX + $padX)
  $maxY = [Math]::Min($bitmap.Height - 1, $maxY + $padY)

  return [System.Drawing.Rectangle]::new($minX, $minY, $maxX - $minX + 1, $maxY - $minY + 1)
}

foreach ($fileName in $referenced) {
  $path = Join-Path $ImagesDir $fileName
  if (!(Test-Path $path)) {
    Write-Warning "Missing image: $fileName"
    continue
  }

  $resolvedPath = (Resolve-Path $path).Path
  $bitmap = [System.Drawing.Bitmap]::new($resolvedPath)
  $bounds = Get-ContentBounds $bitmap $Threshold

  if ($null -eq $bounds) {
    $bitmap.Dispose()
    Write-Warning "Could not detect content: $fileName"
    continue
  }

  $scale = [Math]::Min(
    ($CanvasWidth * $TargetFill) / $bounds.Width,
    ($CanvasHeight * $TargetFill) / $bounds.Height
  )
  $drawWidth = [Math]::Max(1, [int]($bounds.Width * $scale))
  $drawHeight = [Math]::Max(1, [int]($bounds.Height * $scale))
  $drawX = [int](($CanvasWidth - $drawWidth) / 2)
  $drawY = [int](($CanvasHeight - $drawHeight) / 2)

  $canvas = [System.Drawing.Bitmap]::new($CanvasWidth, $CanvasHeight)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

  $destRect = [System.Drawing.Rectangle]::new($drawX, $drawY, $drawWidth, $drawHeight)
  $graphics.DrawImage($bitmap, $destRect, $bounds, [System.Drawing.GraphicsUnit]::Pixel)

  $bitmap.Dispose()
  $graphics.Dispose()

  $extension = [IO.Path]::GetExtension($path).ToLowerInvariant()
  if ($extension -eq ".jpg" -or $extension -eq ".jpeg") {
    $canvas.Save($resolvedPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
  } else {
    $canvas.Save($resolvedPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }

  $canvas.Dispose()
  Write-Host "Normalized $fileName"
}
