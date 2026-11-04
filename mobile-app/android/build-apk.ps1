$env:JAVA_HOME = "F:\tools\jdk-21\jdk-21.0.13.0.2+1"
$env:ANDROID_HOME = "F:\tools\android-sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "Using JAVA_HOME: $env:JAVA_HOME"
Write-Host "Using ANDROID_HOME: $env:ANDROID_HOME"
& "$env:JAVA_HOME\bin\java.exe" -version

Set-Location -Path "F:\API\VaraKoto.com\mobile-app\android"
.\gradlew.bat assembleDebug --stacktrace
