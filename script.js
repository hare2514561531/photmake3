// アプリケーションの状態管理
class AlertImageApp {
  constructor() {
    this.config = {
      type: "heavyRainSpecial",
      level: "danger",
      message: "命を守る行動を！",
      targetArea: "名古屋市",
      backgroundColor: "#dc2626",
      textColor: "#ffffff",
      credit: "画像制作: EWC画像制作部",
    }

    this.alertTypes = {
      heavyRain: { label: "大雨警報", color: "#dc2626", defaultMessage: "命を守る行動を！" },
      heavyRainSpecial: { label: "大雨特別警報", color: "#dc2626", defaultMessage: "命を守る行動を！" },
      flood: { label: "洪水警報", color: "#2563eb", defaultMessage: "速やかに安全な場所へ避難を！" },
      storm: { label: "暴風警報", color: "#7c3aed", defaultMessage: "外出を控え、頑丈な建物内に待機を！" },
      tsunami: { label: "津波警報", color: "#0891b2", defaultMessage: "直ちに高台へ避難を！" },
      tsunamiSpecial: { label: "大津波警報", color: "#0891b2", defaultMessage: "直ちに高台へ避難を！" },
      earthquake: { label: "地震警報", color: "#ea580c", defaultMessage: "落ち着いて身の安全を確保してください！" },
      fire: { label: "火災警報", color: "#dc2626", defaultMessage: "直ちに避難してください！" },
      thunder: { label: "雷警報", color: "#facc15", defaultMessage: "建物内に避難してください！" },
      volcano: { label: "火山警報", color: "#dc2626", defaultMessage: "直ちに危険区域から離れてください！" },
      heatwave: { label: "熱中症警報", color: "#f97316", defaultMessage: "水分をこまめに取り、涼しい場所で休憩を！" },
      general: { label: "一般警報", color: "#dc2626", defaultMessage: "今後の情報に注意してください！" },
    }

    this.adminData = {
      templates: [
        {
          id: "1",
          name: "大雨特別警報テンプレート",
          type: "heavyRainSpecial",
          message: "命を守る行動を！",
          targetArea: "全国",
          backgroundColor: "#dc2626",
          textColor: "#ffffff",
          usage: 245,
          lastUsed: "2024-01-15",
          status: "active",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          name: "津波警報テンプレート",
          type: "tsunami",
          message: "直ちに高台へ避難を！",
          targetArea: "沿岸部",
          backgroundColor: "#0891b2",
          textColor: "#ffffff",
          usage: 89,
          lastUsed: "2024-01-10",
          status: "active",
          createdAt: "2024-01-02",
          updatedAt: "2024-01-02",
        },
      ],
      users: [
        {
          id: "1",
          name: "田中太郎",
          email: "tanaka@example.com",
          role: "admin",
          lastActive: "2024-01-15",
          alertsCreated: 45,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          name: "佐藤花子",
          email: "sato@example.com",
          role: "editor",
          lastActive: "2024-01-14",
          alertsCreated: 32,
          createdAt: "2024-01-02",
          updatedAt: "2024-01-02",
        },
      ],
      settings: {
        systemName: "警報画像作成システム",
        maxUsers: 100,
        storageLimit: 50,
        emailNotifications: "admin@example.com",
        alertThreshold: 1000,
        backupFrequency: "毎日",
        lastBackup: null,
        updatedAt: new Date().toISOString(),
      },
    }

    this.isAdminAuthenticated = false
    this.searchQuery = ""

    this.init()
  }

  init() {
    this.loadData()
    this.setupEventListeners()
    this.checkAdminAuth()
    this.drawAlert()
  }

  // データの読み込み
  loadData() {
    const savedTemplates = localStorage.getItem("adminTemplates")
    const savedUsers = localStorage.getItem("adminUsers")
    const savedSettings = localStorage.getItem("adminSettings")

    if (savedTemplates) {
      this.adminData.templates = JSON.parse(savedTemplates)
    }

    if (savedUsers) {
      this.adminData.users = JSON.parse(savedUsers)
    }

    if (savedSettings) {
      this.adminData.settings = JSON.parse(savedSettings)
    }
  }

  // データの保存
  saveData() {
    try {
      localStorage.setItem("adminTemplates", JSON.stringify(this.adminData.templates))
      localStorage.setItem("adminUsers", JSON.stringify(this.adminData.users))
      localStorage.setItem("adminSettings", JSON.stringify(this.adminData.settings))
    } catch (error) {
      console.error("データの保存に失敗しました", error)
      this.showToast("エラー", "データの保存に失敗しました", "error")
    }
  }

  // 管理者認証チェック
  checkAdminAuth() {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    const loginTime = localStorage.getItem("adminLoginTime")

    if (isAuthenticated && loginTime) {
      const now = Date.now()
      const loginTimestamp = Number.parseInt(loginTime)
      const sessionDuration = 24 * 60 * 60 * 1000 // 24時間

      if (now - loginTimestamp < sessionDuration) {
        this.isAdminAuthenticated = true
        this.showAdminDashboard()
      } else {
        localStorage.removeItem("adminAuthenticated")
        localStorage.removeItem("adminLoginTime")
        this.isAdminAuthenticated = false
      }
    }
  }

  // イベントリスナーの設定
  setupEventListeners() {
    // ナビゲーションタブ
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.currentTarget.dataset.tab
        this.switchMainTab(tabName)
      })
    })

    // 設定タブ
    document.querySelectorAll("[data-settings-tab]").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.currentTarget.dataset.settingsTab
        this.switchSettingsTab(tabName)
      })
    })

    // 管理タブ
    document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.currentTarget.dataset.adminTab
        this.switchAdminTab(tabName)
      })
    })

    // フォーム要素
    document.getElementById("alert-type").addEventListener("change", (e) => {
      this.handleAlertTypeChange(e.target.value)
    })

    document.getElementById("target-area").addEventListener("input", (e) => {
      this.config.targetArea = e.target.value
      this.drawAlert()
    })

    document.getElementById("message").addEventListener("input", (e) => {
      this.config.message = e.target.value
      this.drawAlert()
    })

    document.getElementById("credit").addEventListener("input", (e) => {
      this.config.credit = e.target.value
      this.drawAlert()
    })

    // 色設定
    document.getElementById("bg-color").addEventListener("change", (e) => {
      this.config.backgroundColor = e.target.value
      document.getElementById("bg-color-text").value = e.target.value
      this.drawAlert()
    })

    document.getElementById("bg-color-text").addEventListener("input", (e) => {
      this.config.backgroundColor = e.target.value
      document.getElementById("bg-color").value = e.target.value
      this.drawAlert()
    })

    document.getElementById("text-color").addEventListener("change", (e) => {
      this.config.textColor = e.target.value
      document.getElementById("text-color-text").value = e.target.value
      this.drawAlert()
    })

    document.getElementById("text-color-text").addEventListener("input", (e) => {
      this.config.textColor = e.target.value
      document.getElementById("text-color").value = e.target.value
      this.drawAlert()
    })

    // ボタン
    document.getElementById("download-btn").addEventListener("click", () => {
      this.downloadImage()
    })

    document.getElementById("share-btn").addEventListener("click", () => {
      this.showShareModal()
    })

    // ログイン
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleLogin()
    })

    document.getElementById("toggle-password").addEventListener("click", () => {
      this.togglePasswordVisibility()
    })

    // 管理機能
    document.getElementById("logout-btn").addEventListener("click", () => {
      this.handleLogout()
    })

    document.getElementById("export-btn").addEventListener("click", () => {
      this.exportData()
    })

    document.getElementById("import-btn").addEventListener("click", () => {
      document.getElementById("import-file").click()
    })

    document.getElementById("import-file").addEventListener("change", (e) => {
      this.importData(e)
    })

    // 検索
    document.getElementById("search-input").addEventListener("input", (e) => {
      this.searchQuery = e.target.value
      this.updateSearchUI()
      this.renderTables()
    })

    document.getElementById("clear-search").addEventListener("click", () => {
      this.searchQuery = ""
      document.getElementById("search-input").value = ""
      this.updateSearchUI()
      this.renderTables()
    })

    // モーダル
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.hideModal()
      })
    })

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideModal()
        }
      })
    })

    // 共有ボタン
    document.getElementById("share-twitter").addEventListener("click", () => {
      this.shareToTwitter()
    })

    document.getElementById("share-facebook").addEventListener("click", () => {
      this.shareToFacebook()
    })

    document.getElementById("share-line").addEventListener("click", () => {
      this.shareToLine()
    })

    document.getElementById("share-email").addEventListener("click", () => {
      this.shareByEmail()
    })
  }

  // メインタブの切り替え
  switchMainTab(tabName) {
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.remove("active")
    })
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active")
    })

    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")
    document.getElementById(tabName).classList.add("active")

    if (tabName === "admin" && this.isAdminAuthenticated) {
      this.renderAdminDashboard()
    }
  }

  // 設定タブの切り替え
  switchSettingsTab(tabName) {
    document.querySelectorAll("[data-settings-tab]").forEach((tab) => {
      tab.classList.remove("active")
    })
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.remove("active")
    })

    document.querySelector(`[data-settings-tab="${tabName}"]`).classList.add("active")
    document.getElementById(tabName).classList.add("active")
  }

  // 管理タブの切り替え
  switchAdminTab(tabName) {
    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.classList.remove("active")
    })
    document.querySelectorAll(".admin-tab-panel").forEach((panel) => {
      panel.classList.remove("active")
    })

    document.querySelector(`[data-admin-tab="${tabName}"]`).classList.add("active")
    document.getElementById(tabName).classList.add("active")

    this.renderTables()
  }

  // 警報タイプ変更処理
  handleAlertTypeChange(value) {
    const alertTypeInfo = this.alertTypes[value]
    this.config.type = value
    this.config.backgroundColor = alertTypeInfo.color
    this.config.message = alertTypeInfo.defaultMessage

    // UIの更新
    document.getElementById("bg-color").value = alertTypeInfo.color
    document.getElementById("bg-color-text").value = alertTypeInfo.color
    document.getElementById("message").value = alertTypeInfo.defaultMessage

    this.drawAlert()
  }

  // 日本語テキストの分割
  segmentJapaneseText(text) {
    const locationSuffixes = [
      "都",
      "道",
      "府",
      "県",
      "市",
      "区",
      "町",
      "村",
      "郡",
      "島",
      "半島",
      "山",
      "川",
      "湖",
      "海",
      "湾",
      "丁目",
      "番地",
      "号",
    ]
    const separators = [" ", "　", "・", "、", "，", ",", "及び", "および", "と"]

    const segments = []
    let currentSegment = ""

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      currentSegment += char

      if (separators.includes(char)) {
        if (currentSegment.trim()) {
          segments.push(currentSegment.trim())
        }
        currentSegment = ""
        continue
      }

      if (locationSuffixes.includes(char)) {
        const nextChar = text[i + 1]
        if (!nextChar || !locationSuffixes  {
                const nextChar = text[i + 1];
                if (!nextChar || !locationSuffixes.includes(nextChar)) {
                    if (currentSegment.trim()) {
                        segments.push(currentSegment.trim());
                    }
                    currentSegment = '';
                }
            }
      }

      if (currentSegment.trim()) {
        segments.push(currentSegment.trim())
      }

      return segments.filter((segment) => segment.length > 0)
    }

    // テキストの折り返し処理
    wrapTextByWords(ctx, text, maxWidth)
    {
      const segments = this.segmentJapaneseText(text)
      const lines = []
      let currentLine = ""

      for (const segment of segments) {
        const testLine = currentLine + segment
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && currentLine !== "") {
          lines.push(currentLine.trim())
          currentLine = segment
        } else {
          \
                currentLine = testLine
        }
      }

      if (currentLine.trim() !== "") {
        lines.push(currentLine.trim())
      }

      const finalLines = []
      for (const line of lines) {
        const lineWidth = ctx.measureText(line).width
        if (lineWidth > maxWidth) {
          const charLines = this.wrapTextByChars(ctx, line, maxWidth)
          finalLines.push(...charLines)
        } else {
          finalLines.push(line)
        }
      }

      return finalLines.length > 0 ? finalLines : [text]
      \
    }

    // 文字単位での折り返し
    wrapTextByChars(ctx, text, maxWidth)
    {
      const lines = []
      let currentLine = ""

      for (const char of text) {
        const testLine = currentLine + char
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && currentLine !== "") {
          lines.push(currentLine)
          currentLine = char
        } else {
          currentLine = testLine
        }
      }

      if (currentLine !== "") {
        lines.push(currentLine)
      }

      return lines.length > 0 ? lines : [text]
    }

    // エリアテキストの処理
    processAreaText(ctx, areaText, maxWidth)
    {
      const inputLines = areaText.split("\n").filter((line) => line.trim() !== "")
      const processedLines = []

      for (const line of inputLines) {
        const wrappedLines = this.wrapTextByWords(ctx, line.trim(), maxWidth)
        processedLines.push(...wrappedLines)
      }

      return processedLines
    }

    // 色の調整
    adjustColor(hex, amount)
    {
      \
      let r = Number.parseInt(hex.substring(1, 3), 16)
      let g = Number.parseInt(hex.substring(3, 5), 16)
      let b = Number.parseInt(hex.substring(5, 7), 16)

      r = Math.max(0, Math.min(255, r + amount))
      g = Math.max(0, Math.min(255, g + amount))
      b = Math.max(0, Math.min(255, b + amount))

      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    }

    // 警報画像の描画
    drawAlert()
    {
      const canvas = document.getElementById("alert-canvas")
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = 2060
      \
        canvas.height = 1456

      // 背景色
      ctx.fillStyle = this.config.backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // おしゃれな背景効果
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, this.config.backgroundColor)
      \
        gradient.addColorStop(0.5, this.adjustColor(this.config.backgroundColor, -20))
      gradient.addColorStop(1, this.adjustColor(this.config.backgroundColor, -40))
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 微妙なパターン効果
      ctx.globalAlpha = 0.03
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 150 + 50
        ctx.beginPath()
        \
            ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.fill()
      }
      ctx.globalAlpha = 1.0

      let currentY = 150

      // 警報名
      const selectedType = this.alertTypes[this.config.type]
      const alertName = selectedType.label

      ctx.fillStyle = this.config.textColor
      ctx.font = "bold 180px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // テキストに影を追加
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 3

      ctx.fillText(alertName, canvas.width / 2, currentY)
      currentY += 180

      // メッセージ
      ctx.font = "bold 100px sans-serif"
      ctx.textBaseline = "middle"
      const messageLines = this.config.message.split("\n")
      messageLines.forEach((line) => {
        ctx.fillText(line, canvas.width / 2, currentY)
        currentY += 120
      })
      currentY += 40

      // 影をリセット
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // 白い横線
      ctx.strokeStyle = this.config.textColor
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(0, currentY)
      ctx.lineTo(canvas.width, currentY)
      ctx.stroke()
      currentY += 120

      // 対象地域の処理
      const maxBoxWidth = canvas.width - 200
      const minBoxWidth = 800
      const horizontalPadding = 60
      const verticalPadding = 40
      const lineHeight = 100

      ctx.font = "bold 80px sans-serif"

      const maxTextWidth = maxBoxWidth - horizontalPadding * 2
      const processedLines = this.processAreaText(ctx, this.config.targetArea, maxTextWidth)

      const actualTextWidth = Math.max(...processedLines.map((line) => ctx.measureText(line).width))
      const areaBoxWidth = Math.min(maxBoxWidth, Math.max(minBoxWidth, actualTextWidth + horizontalPadding * 2))

      const lineCount = processedLines.length
      const areaBoxHeight = lineCount * lineHeight + verticalPadding * 2

      const areaBoxX = (canvas.width - areaBoxWidth) / 2
      const areaBoxY = currentY - 20
      const cornerRadius = 40

      // 白い角丸の背景（枠線なし）
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.roundRect(areaBoxX, areaBoxY, areaBoxWidth, areaBoxHeight, cornerRadius)
      ctx.fill()

      // 対象地域のテキスト（黒文字）
      ctx.fillStyle = "#000000"
      ctx.font = "bold 80px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const startY = areaBoxY + verticalPadding + lineHeight / 2
      processedLines.forEach((line, index) => {
        const textY = startY + index * lineHeight
        ctx.fillText(line, canvas.width / 2, textY)
      })

      currentY = areaBoxY + areaBoxHeight + 60

      // クレジット
      ctx.fillStyle = this.config.textColor
      ctx.font = "40px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(this.config.credit, 40, canvas.height - 40)
    }

    // 画像ダウンロード
    downloadImage()
    {
      const canvas = document.getElementById("alert-canvas")
      if (!canvas) return

      const link = document.createElement("a")
      link.download = `alert-${this.config.type}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()

      this.showToast("ダウンロード完了", "警報画像をダウンロードしました")
    }

    // 共有URL生成
    generateShareUrl()
    {
      const params = new URLSearchParams({
        type: this.config.type,
        message: this.config.message,
        area: this.config.targetArea,
        bg: this.config.backgroundColor,
        text: this.config.textColor,
      })
      return `${window.location.origin}${window.location.pathname}?${params.toString()}`
    }

    // 共有モーダル表示
    showShareModal()
    document.getElementById("share-modal").classList.add("show")

    // Twitter共有
    shareToTwitter()
    {
      const url = this.generateShareUrl()
      const text = `${this.config.message} - ${this.config.targetArea}の警報画像を作成しました`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
    }

    // Facebook共有
    shareToFacebook()
    {
      const url = this.generateShareUrl()
      window.open(\`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
    }

    // LINE共有
    shareToLine()
    {
      const url = this.generateShareUrl()
      const text = `${this.config.message} - ${this.config.targetArea}の警報画像`
      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      )
    }

    // メール共有
    shareByEmail()
    {
      \
      const url = this.generateShareUrl()
      const subject = `警報画像: ${this.config.message}`
      const body = `${this.config.targetArea}の警報画像を共有します。\n\n詳細: ${url}`
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }

    // パスワード表示切り替え
    togglePasswordVisibility()
    {
      const passwordInput = document.getElementById("admin-password")
      \
      const toggleBtn = document.getElementById("toggle-password")
      const icon = toggleBtn.querySelector("i")

      if (passwordInput.type === \'password'
      )
      passwordInput.type = "text"
      icon.className = "fas fa-eye-off"
      else
      passwordInput.type = "password"
      icon.className = "fas fa-eye"
    }

    // ログイン処理
    async
    handleLogin()
    {
      const password = document.getElementById('admin-password\').value;
      const loginBtn = document.getElementById("login-btn")

      loginBtn.textContent = "認証中..."
      loginBtn.disabled = true

      // 簡単な遅延でリアルな認証体験を演出\
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (password === "admin2024") {
        localStorage.setItem("adminAuthenticated", "true")
        localStorage.setItem("adminLoginTime", Date.now().toString())

        this.isAdminAuthenticated = true
        \
            this.showAdminDashboard()
        this.showToast("ログイン成功", "管理画面にアクセスしました")
      } else {
        this.showToast("ログイン失敗", "パスワードが正しくありません", "error")
      }

      loginBtn.textContent = "ログイン"
      loginBtn.disabled = false
      document.getElementById("admin-password").value = ""
    }

    // ログアウト処理
    handleLogout()
    localStorage.removeItem(\'adminAuthenticated\');
        localStorage.removeItem('adminLoginTime')
      this.isAdminAuthenticated = false
      this.showAdminLogin()
      this.showToast("ログアウトしました", "管理画面からログアウトしました")

    // 管理ログイン画面表示\
    showAdminLogin()
    \
        document.getElementById('admin-login').style.display = 'flex'
      document.getElementById(\'admin-dashboard').style.display = "none"

    // 管理ダッシュボード表示
    showAdminDashboard()
    document.getElementById('admin-login\').style.display = 'none\';\
        document.getElementById(\'admin-dashboard\').style.display = 'block';\
        this.renderAdminDashboard();

    // 管理ダッシュボードのレンダリング
    renderAdminDashboard()
    this.updateStats()
    this.renderTables()

    // 統計の更新
    updateStats()
    {
      const stats = {
        totalTemplates: this.adminData.templates.length,
        activeTemplates: this.adminData.templates.filter((t) => t.status === "active").length,
        totalUsers: this.adminData.users.length,
        adminUsers: this.adminData.users.filter((u) => u.role === "admin").length,
        totalUsage: this.adminData.templates.reduce((sum, t) => sum + t.usage, 0),
        totalAlerts: this.adminData.users.reduce((sum, u) => sum + u.alertsCreated, 0),
      }

      document.getElementById("total-templates").textContent = stats.totalTemplates
      document.getElementById("active-templates").textContent = stats.activeTemplates
      document.getElementById("total-users").textContent = stats.totalUsers
      \
        document.getElementById('admin-users\').textContent = stats.adminUsers;\
        document.getElementById('total-usage\').textContent = stats.totalUsage.toLocaleString();
        document.getElementById('total-alerts').textContent = stats.totalAlerts.toLocaleString()
    }

    // テーブルのレンダリング
    renderTables()
    this.renderTemplatesTable()
    \
        this.renderUsersTable()

    // テンプレートテーブルのレンダリング
    renderTemplatesTable()
    {
      \
      const tbody = document.getElementById("templates-table")
      const filteredTemplates = this.adminData.templates.filter(
        (template) =>
          template.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          template.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          template.message.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          template.targetArea.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )

      tbody.innerHTML = ""

      if (filteredTemplates.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
                        ${this.searchQuery ? "検索条件に一致するテンプレートがありません" : "テンプレートがありません"}
                    </td>
                </tr>
            `
        return
      }

      filteredTemplates.forEach((template) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                <td style="font-weight: 600;">${template.name}</td>
                <td>${template.type}</td>
                <td>${template.usage.toLocaleString()}</td>
                <td>${template.lastUsed}</td>
                <td><span class="status-badge status-${template.status}">${template.status}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-outline" onclick="app.editTemplate('${template.id}')" title="編集">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline btn-danger" onclick="app.deleteTemplate('${template.id}')" title="削除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `
        tbody.appendChild(row)
      })
    }

    // ユーザーテーブルのレンダリング
    renderUsersTable()
    {
      const tbody = document.getElementById("users-table")
      const filteredUsers = this.adminData.users.filter(
        (user) =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )

      tbody.innerHTML = ""

      if (filteredUsers.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
                        ${this.searchQuery ? "検索条件に一致するユーザーがありません" : "ユーザーがありません"}
                    </td>
                </tr>
            `
        return
      }

      filteredUsers.forEach((user) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                <td style="font-weight: 600;">${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge role-${user.role}">${user.role}</span></td>
                <td>${user.lastActive}</td>
                <td>${user.alertsCreated}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-outline" onclick="app.editUser('${user.id}')" title="編集">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline btn-danger" onclick="app.deleteUser('${user.id}')" title="削除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `
        tbody.appendChild(row)
      })
    }

    // 検索UIの更新
    updateSearchUI()
    {
      const clearBtn = document.getElementById("clear-search")
      if (this.searchQuery) {
        clearBtn.style.display = "block"
      } else {
        clearBtn.style.display = "none"
      }
    }

    // テンプレート編集
    editTemplate(id)
    {
      const template = this.adminData.templates.find((t) => t.id === id)
      if (!template) return

      this.showModal("テンプレート編集", this.createTemplateForm(template))
    }

    // テンプレート削除
    deleteTemplate(id)
    if (confirm("このテンプレートを削除しますか？この操作は元に戻せません。")) {
      const template = this.adminData.templates.find((t) => t.id === id)
      this.adminData.templates = this.adminData.templates.filter((t) => t.id !== id)
      this.saveData()
      this.renderTables()
      this.updateStats()
      this.showToast("削除完了", `${template?.name}を削除しました`)
    }

    // ユーザー編集
    editUser(id)
    {
      const user = this.adminData.users.find((u) => u.id === id)
      if (!user) return

      this.showModal("ユーザー編集", this.createUserForm(user))
    }

    // ユーザー削除
    deleteUser(id)
    if (confirm("このユーザーを削除しますか？この操作は元に戻せません。")) {
      const user = this.adminData.users.find((u) => u.id === id)
      this.adminData.users = this.adminData.users.filter((u) => u.id !== id)
      this.saveData()
      this.renderTables()
      this.updateStats()
      this.showToast("削除完了", `${user?.name}を削除しました`)
    }

    // テンプレートフォーム作成
    createTemplateForm((template = null))
    {
      const isEdit = template !== null
      const formData = template || {
        name: "",
        type: "heavyRainSpecial",
        message: "",
        targetArea: "",
        backgroundColor: "#dc2626",
        textColor: "#ffffff",
        status: "active",
      }

      return `
            <form id="template-form">
                <div class="form-group">
                    <label for="template-name">テンプレート名</label>
                    <input type="text" id="template-name" class="form-control" value="${formData.name}" required>
                </div>
                <div class="form-group">
                    <label for="template-type">種類</label>
                    <input type="text" id="template-type" class="form-control" value="${formData.type}" required>
                </div>
                <div class="form-group">
                    <label for="template-message">メッセージ</label>
                    <textarea id="template-message" class="form-control" rows="3" required>${formData.message}</textarea>
                </div>
                <div class="form-group">
                    <label for="template-area">対象地域</label>
                    <input type="text" id="template-area" class="form-control" value="${formData.targetArea}" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                        <label for="template-bg">背景色</label>
                        <div class="color-input-group">
                            <input type="color" id="template-bg" value="${formData.backgroundColor}">
                            <input type="text" id="template-bg-text" class="form-control" value="${formData.backgroundColor}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="template-text">文字色</label>
                        <div class="color-input-group">
                            <input type="color" id="template-text" value="${formData.textColor}">
                            <input type="text" id="template-text-text" class="form-control" value="${formData.textColor}">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="template-status">ステータス</label>
                    <select id="template-status" class="form-control">
                        <option value="active" ${formData.status === "active" ? "selected" : ""}>アクティブ</option>
                        <option value="draft" ${formData.status === "draft" ? "selected" : ""}>下書き</option>
                        <option value="archived" ${formData.status === "archived" ? "selected" : ""}>アーカイブ</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-save"></i>
                        保存
                    </button>
                    <button type="button" class="btn btn-outline" onclick="app.hideModal()">
                        <i class="fas fa-times"></i>
                        キャンセル
                    </button>
                </div>
            </form>
        `
    }

    // ユーザーフォーム作成
    createUserForm((user = null))
    {
      const isEdit = user !== null
      const formData = user || {
        name: "",
        email: "",
        role: "viewer",
      }

      return `
            <form id="user-form">
                <div class="form-group">
                    <label for="user-name">ユーザー名</label>
                    <input type="text" id="user-name" class="form-control" value="${formData.name}" required>
                </div>
                <div class="form-group">
                    <label for="user-email">メールアドレス</label>
                    <input type="email" id="user-email" class="form-control" value="${formData.email}" required>
                </div>
                <div class="form-group">
                    <label for="user-role">権限</label>
                    <select id="user-role" class="form-control">
                        <option value="admin" ${formData.role === "admin" ? "selected" : ""}>管理者</option>
                        <option value="editor" ${formData.role === "editor" ? "selected" : ""}>編集者</option>
                        <option value="viewer" ${formData.role === "viewer" ? "selected" : ""}>閲覧者</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-save"></i>
                        保存
                    </button>
                    <button type="button" class="btn btn-outline" onclick="app.hideModal()">
                        <i class="fas fa-times"></i>
                        キャンセル
                    </button>
                </div>
            </form>
        `
    }

    // データエクスポート
    exportData()
    try {
      const exportData = {
        templates: this.adminData.templates,
        users: this.adminData.users,
        settings: this.adminData.settings,
        exportDate: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileName = `alert-system-export-${new Date().toISOString().split("T")[0]}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileName)
      linkElement.click()

      this.showToast("エクスポート完了", "システムデータのエクスポートが完了しました")
    } catch (error) {
      console.error("データのエクスポートに失敗しました", error)
      this.showToast("エラー", "データのエクスポートに失敗しました", "error")
    }

    // データインポート
    importData(event)
    try {
      const file = event.target.files?.[0]
      if (!file) {
        this.showToast("エラー", "ファイルが選択されていません", "error")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result
          const importedData = JSON.parse(content)

          if (importedData.templates && Array.isArray(importedData.templates)) {
            this.adminData.templates = importedData.templates
          }

          if (importedData.users && Array.isArray(importedData.users)) {
            this.adminData.users = importedData.users
          }

          if (importedData.settings) {
            this.adminData.settings = {
              ...importedData.settings,
              updatedAt: new Date().toISOString(),
            }
          }

          this.saveData()
          this.renderAdminDashboard()
          this.showToast("インポート完了", "システムデータのインポートが完了しました")
        } catch (error) {
          console.error("インポートデータの解析に失敗しました", error)
          this.showToast("エラー", "インポートデータの形式が正しくありません", "error")
        }
      }

      reader.readAsText(file)
    } catch (error) {
      console.error("データのインポートに失敗しました", error)
      this.showToast("エラー", "データのインポートに失敗しました", "error")
    } finally {
      // ファイル選択をリセット
      event.target.value = ""
    }

    // モーダル表示
    showModal(title, content)
    {
      document.getElementById("modal-title").textContent = title
      document.getElementById("modal-body").innerHTML = content
      document.getElementById("modal").classList.add("show")

      // フォームイベントリスナーを設定
      const form = document.querySelector("#modal form")
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault()
          this.handleFormSubmit(form)
        })
      }
    }

    // モーダル非表示
    hideModal()
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("show")
    })

    // フォーム送信処理
    handleFormSubmit(form)
    {
      const formId = form.id

      if (formId === "template-form") {
        this.saveTemplate(form)
      } else if (formId === "user-form") {
        this.saveUser(form)
      }
    }

    // テンプレート保存
    saveTemplate(form)
    {
      const formData = new FormData(form)
      const templateData = {
        name: document.getElementById("template-name").value,
        type: document.getElementById("template-type").value,
        message: document.getElementById("template-message").value,
        targetArea: document.getElementById("template-area").value,
        backgroundColor: document.getElementById("template-bg").value,
        textColor: document.getElementById("template-text").value,
        status: document.getElementById("template-status").value,
      }

      // 既存テンプレートの編集か新規作成かを判定
      const existingTemplate = this.adminData.templates.find((t) => t.name === templateData.name)

      if (existingTemplate) {
        // 編集
        Object.assign(existingTemplate, templateData, {
          updatedAt: new Date().toISOString(),
        })
        this.showToast("更新完了", `${templateData.name}を更新しました`)
      } else {
        // 新規作成
        const newTemplate = {
          ...templateData,
          id: Date.now().toString(),
          usage: 0,
          lastUsed: new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        this.adminData.templates.push(newTemplate)
        this.showToast("作成完了", `${templateData.name}を作成しました`)
      }

      this.saveData()
      this.renderTables()
      this.updateStats()
      this.hideModal()
    }

    // ユーザー保存
    saveUser(form)
    {
      const userData = {
        name: document.getElementById("user-name").value,
        email: document.getElementById("user-email").value,
        role: document.getElementById("user-role").value,
      }

      // 既存ユーザーの編集か新規作成かを判定
      const existingUser = this.adminData.users.find((u) => u.email === userData.email)

      if (existingUser) {
        // 編集
        Object.assign(existingUser, userData, {
          updatedAt: new Date().toISOString(),
        })
        this.showToast("更新完了", `${userData.name}を更新しました`)
      } else {
        // 新規作成
        const newUser = {
          ...userData,
          id: Date.now().toString(),
          lastActive: new Date().toISOString().split("T")[0],
          alertsCreated: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        this.adminData.users.push(newUser)
        this.showToast("作成完了", `${userData.name}を作成しました`)
      }

      this.saveData()
      this.renderTables()
      this.updateStats()
      this.hideModal()
    }

    // トースト通知表示
    showToast(title, message, (type = "success"))
    {
      const toast = document.createElement("div")
      toast.className = `toast ${type === "error" ? "error" : ""}`
      toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        `

      const container = document.getElementById("toast-container")
      container.appendChild(toast)

      // 3秒後に自動削除
      setTimeout(() => {
        toast.remove()
      }, 3000)
    }
  }

  // アプリケーション初期化
  let
  app
  document;
  .
  addEventListener('DOMContentLoaded', ()
  => {
  app = new AlertImageApp()
}
)
