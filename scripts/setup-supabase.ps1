# Supabase Setup Script for Windows
Write-Host "Setting up Supabase for Tool Hub project..." -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✓ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not available. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Install Supabase CLI using Scoop (recommended for Windows)
Write-Host "Installing Supabase CLI..." -ForegroundColor Yellow

# Check if Scoop is installed
try {
    scoop --version | Out-Null
    Write-Host "✓ Scoop is available" -ForegroundColor Green
    
    # Install Supabase CLI
    scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
    scoop install supabase
    
} catch {
    Write-Host "Scoop not found. Installing via direct download..." -ForegroundColor Yellow
    
    # Alternative: Download and install manually
    $url = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"
    $output = "$env:TEMP\supabase.zip"
    $extractPath = "$env:LOCALAPPDATA\supabase"
    
    Write-Host "Downloading Supabase CLI..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $url -OutFile $output
    
    Write-Host "Extracting..." -ForegroundColor Yellow
    Expand-Archive -Path $output -DestinationPath $extractPath -Force
    
    # Add to PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$extractPath*") {
        [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$extractPath", "User")
        Write-Host "Added Supabase to PATH. Please restart your terminal." -ForegroundColor Yellow
    }
}

Write-Host "Supabase CLI installation completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your terminal" -ForegroundColor White
Write-Host "2. Run: supabase start" -ForegroundColor White
Write-Host "3. Update your .env file with the provided keys" -ForegroundColor White