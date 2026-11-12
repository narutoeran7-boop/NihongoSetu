$ErrorActionPreference = "Continue"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   NIHONGO SETU: COMPREHENSIVE AUTHENTICATION TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

$LocalBase = "http://localhost:3000"
$PublicBase = "https://popularity-theology-greetings-engaged.trycloudflare.com"

function Run-Suite($BaseUrl, $Label) {
    Write-Host "--------------------------------------------------------" -ForegroundColor Yellow
    Write-Host " RUNNING TESTS AGAINST: $Label ($BaseUrl)" -ForegroundColor Yellow
    Write-Host "--------------------------------------------------------`n" -ForegroundColor Yellow

    # TEST 1: Student Login with Valid Credentials
    Write-Host "[TEST 1] Student Login with Valid Credentials (student@nihongosetu.org / Sakura@2026!JLPT)..." -NoNewline
    $body = @{
        email = "student@nihongosetu.org"
        password = "Sakura@2026!JLPT"
        role = "student"
    } | ConvertTo-Json
    
    $loginSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    try {
        $res = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json" -WebSession $loginSession
        if ($res.success -eq $true -and $res.redirect -eq "/portal" -and $res.user.email -eq "student@nihongosetu.org") {
            Write-Host " [PASS]" -ForegroundColor Green
            Write-Host "   -> User: $($res.user.name), Role: $($res.user.role), Redirect: $($res.redirect)" -ForegroundColor Gray
        } else {
            Write-Host " [FAIL]" -ForegroundColor Red
            Write-Host "   -> Response: $($res | ConvertTo-Json -Compress)" -ForegroundColor Red
        }
    } catch {
        Write-Host " [FAIL - Exception: $_]" -ForegroundColor Red
    }

    # TEST 2: Student Login with Invalid Password
    Write-Host "[TEST 2] Student Login with Invalid Password..." -NoNewline
    $badBody = @{
        email = "student@nihongosetu.org"
        password = "WrongPassword123!"
        role = "student"
    } | ConvertTo-Json

    try {
        $badRes = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $badBody -ContentType "application/json"
        Write-Host " [FAIL: Expected 401 but got 200]" -ForegroundColor Red
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 401) {
            Write-Host " [PASS - Correctly rejected with 401 Unauthorized]" -ForegroundColor Green
        } else {
            Write-Host " [FAIL - Status: $status]" -ForegroundColor Red
        }
    }

    # TEST 3: Student Login with Empty Fields
    Write-Host "[TEST 3] Student Login with Empty Fields..." -NoNewline
    $emptyBody = @{
        email = ""
        password = ""
        role = "student"
    } | ConvertTo-Json

    try {
        $emptyRes = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $emptyBody -ContentType "application/json"
        Write-Host " [FAIL: Expected 400 but got 200]" -ForegroundColor Red
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 400) {
            Write-Host " [PASS - Correctly rejected with 400 Bad Request]" -ForegroundColor Green
        } else {
            Write-Host " [FAIL - Status: $status]" -ForegroundColor Red
        }
    }

    # TEST 4: Student Demo 1-Click Access
    Write-Host "[TEST 4] Student Demo 1-Click Access (POST /api/auth/demo)..." -NoNewline
    $demoSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $demoBody = @{ role = "student" } | ConvertTo-Json
    $demoCookieHeader = ""
    try {
        $webReq = [System.Net.HttpWebRequest]::Create("$BaseUrl/api/auth/demo")
        $webReq.Method = "POST"
        $webReq.ContentType = "application/json"
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($demoBody)
        $webReq.ContentLength = $bytes.Length
        $reqStream = $webReq.GetRequestStream()
        $reqStream.Write($bytes, 0, $bytes.Length)
        $reqStream.Close()
        $webResp = $webReq.GetResponse()
        $setCookie = $webResp.Headers["Set-Cookie"]
        if ($setCookie -match "nihongo_session=([^;]+)") {
            $demoCookieHeader = "nihongo_session=$($matches[1])"
        }
        $reader = New-Object System.IO.StreamReader($webResp.GetResponseStream())
        $rawJson = $reader.ReadToEnd()
        $reader.Close()
        $webResp.Close()
        $demoRes = $rawJson | ConvertFrom-Json

        if ($demoRes.success -eq $true -and $demoRes.redirect -eq "/portal" -and $demoRes.user.isDemo -eq $true) {
            Write-Host " [PASS]" -ForegroundColor Green
            Write-Host "   -> Demo User: $($demoRes.user.name), Redirect: $($demoRes.redirect), isDemo: $($demoRes.user.isDemo)" -ForegroundColor Gray
        } else {
            Write-Host " [FAIL]" -ForegroundColor Red
            Write-Host "   -> Response: $rawJson" -ForegroundColor Red
        }
    } catch {
        Write-Host " [FAIL - Exception: $_]" -ForegroundColor Red
    }

    # TEST 5: Verify Active Session Endpoint
    Write-Host "[TEST 5] Query /api/auth/session with Demo Session Cookie..." -NoNewline
    try {
        $headers = @{}
        if ($demoCookieHeader) { $headers["Cookie"] = $demoCookieHeader }
        $sessCheck = Invoke-RestMethod -Uri "$BaseUrl/api/auth/session" -Method Get -Headers $headers
        if ($sessCheck.authenticated -eq $true -and $sessCheck.user.role -eq "student") {
            Write-Host " [PASS]" -ForegroundColor Green
            Write-Host "   -> Authenticated: $($sessCheck.authenticated), Email: $($sessCheck.user.email), isDemo: $($sessCheck.user.isDemo)" -ForegroundColor Gray
        } else {
            Write-Host " [FAIL - Authenticated: $($sessCheck.authenticated)]" -ForegroundColor Red
        }
    } catch {
        Write-Host " [FAIL - Exception: $_]" -ForegroundColor Red
    }

    # TEST 6: Dashboard Refresh & Session Persistence
    Write-Host "[TEST 6] Dashboard (/portal) Access with Session Cookie (Persistence)..." -NoNewline
    try {
        $headers = @{}
        if ($demoCookieHeader) { $headers["Cookie"] = $demoCookieHeader }
        $portalPage = Invoke-WebRequest -Uri "$BaseUrl/portal" -Method Get -Headers $headers -UseBasicParsing -MaximumRedirection 0
        if ($portalPage.StatusCode -eq 200) {
            Write-Host " [PASS - HTTP 200 OK]" -ForegroundColor Green
        } else {
            Write-Host " [FAIL - HTTP $($portalPage.StatusCode)]" -ForegroundColor Red
        }
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq 200) {
            Write-Host " [PASS - HTTP 200 OK]" -ForegroundColor Green
        } else {
            Write-Host " [FAIL - Status: $status, Exception: $_]" -ForegroundColor Red
        }
    }

    # TEST 7: Inter-Page Portal Navigation (/portal/kana, /portal/sensei)
    Write-Host "[TEST 7] Inter-Page Portal Navigation (/portal/kana & /portal/sensei)..." -NoNewline
    try {
        $headers = @{}
        if ($demoCookieHeader) { $headers["Cookie"] = $demoCookieHeader }
        $kanaPage = Invoke-WebRequest -Uri "$BaseUrl/portal/kana" -Method Get -Headers $headers -UseBasicParsing -MaximumRedirection 0
        $senseiPage = Invoke-WebRequest -Uri "$BaseUrl/portal/sensei" -Method Get -Headers $headers -UseBasicParsing -MaximumRedirection 0
        if ($kanaPage.StatusCode -eq 200 -and $senseiPage.StatusCode -eq 200) {
            Write-Host " [PASS - Both returned HTTP 200 OK]" -ForegroundColor Green
        } else {
            Write-Host " [FAIL - Kana: $($kanaPage.StatusCode), Sensei: $($senseiPage.StatusCode)]" -ForegroundColor Red
        }
    } catch {
        Write-Host " [FAIL - Exception: $_]" -ForegroundColor Red
    }

    # TEST 8: Logout and Session Termination
    Write-Host "[TEST 8] Logout (/api/auth/logout) and Revocation Check..." -NoNewline
    try {
        $headers = @{}
        if ($demoCookieHeader) { $headers["Cookie"] = $demoCookieHeader }
        $logoutRes = Invoke-RestMethod -Uri "$BaseUrl/api/auth/logout" -Method Post -Headers $headers
        
        # Now querying /portal without the session cookie must redirect to /login
        $unauthStatus = $null
        $location = ""
        try {
            $unauthReq = Invoke-WebRequest -Uri "$BaseUrl/portal" -Method Get -UseBasicParsing -MaximumRedirection 0
            $unauthStatus = $unauthReq.StatusCode
        } catch {
            $unauthStatus = $_.Exception.Response.StatusCode.value__
            $location = $_.Exception.Response.Headers["Location"]
        }

        if ($logoutRes.success -eq $true -and ($unauthStatus -eq 307 -or $location -like "*login*")) {
            Write-Host " [PASS - Session revoked & protected /portal redirects to $location]" -ForegroundColor Green
        } else {
            Write-Host " [FAIL - Status: $unauthStatus, Location: $location]" -ForegroundColor Red
        }
    } catch {
        Write-Host " [FAIL - Exception: $_]" -ForegroundColor Red
    }

    Write-Host "`n"
}

# Run local suite
Run-Suite $LocalBase "LOCAL ENVIRONMENT"

# Run public Cloudflare tunnel suite
Run-Suite $PublicBase "PUBLIC CLOUDFLARE HTTPS TUNNEL"
