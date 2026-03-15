<h1 align="center">
  <img src="src/assets/branding/128.png" alt="Logo" width="128" height="128" style="border-radius: 20px;"/><br>
  ✦ NEWTUBE ✦
</h1>

<p align="center">
  <strong>◈ A modern YouTube style customizer extension ◈</strong>
  <br>
  <strong>◈ Powered by StyleShift (Custom Style Engine) ◈</strong>
</p>

<p align="center">
  <a href="https://github.com/AzPepoze/NewTube/releases/latest">
    <img src="https://img.shields.io/github/v/release/AzPepoze/NewTube?style=for-the-badge&label=%E2%97%88%20RELEASE%20%E2%97%88&labelColor=white&color=white" alt="Latest Release">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/AzPepoze/NewTube?style=for-the-badge&label=%E2%97%88%20LICENSE%20%E2%97%88&labelColor=white&color=white" alt="License">
  </a>
  <a href="https://github.com/AzPepoze/NewTube/stargazers">
    <img src="https://img.shields.io/github/stars/AzPepoze/NewTube?style=for-the-badge&label=%E2%97%88%20STARS%20%E2%97%88&labelColor=white&color=white" alt="Stars">
  </a>
  <a href="https://chrome.google.com/webstore/detail/youtube-style-customizer/dnjjchajjdnfbjhjclmilicgheglcopj">
   <img src="https://img.shields.io/chrome-web-store/users/dnjjchajjdnfbjhjclmilicgheglcopj?style=for-the-badge&label=%E2%97%88%20USERS%20%E2%97%88&labelColor=white&color=white" alt="Chrome Users">
  </a>
</p>


## Install the Extension

<p align="center">
  <a href="https://chrome.google.com/webstore/detail/youtube-style-customizer/dnjjchajjdnfbjhjclmilicgheglcopj">
    <img src="https://img.shields.io/chrome-web-store/v/dnjjchajjdnfbjhjclmilicgheglcopj?style=for-the-badge&label=%E2%97%88%20CHROME%20%E2%97%88&labelColor=white&color=white&logo=google-chrome" alt="Chrome Web Store">
  </a>
  <a href="https://addons.mozilla.org/firefox/addon/newtube-youtubestylecustomizer/">
    <img src="https://img.shields.io/amo/v/newtube-youtubestylecustomizer?style=for-the-badge&label=%E2%97%88%20FIREFOX%20%E2%97%88&labelColor=white&color=white&logo=firefox-browser" alt="Firefox Add-ons">
  </a>
</p>

## CONTENTS

- [CONTENTS](#contents)
- [INSTALL THE EXTENSION](#install-the-extension)
- [CHROME WEB STORE STATISTICS](#chrome-web-store-statistics)
- [FIREFOX ADD-ON STATISTICS](#firefox-add-on-statistics)
- [DEVELOPMENT STATUS](#development-status)
- [SOCIALS](#socials)
- [PREREQUISITES](#prerequisites)
- [BUILD FROM SOURCE](#build-from-source)
- [DEVELOPMENT](#development)
- [CONTRIBUTING](#contributing)

### [Development Status](https://github.com/users/AzPepoze/projects/1)


### <img src="https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHHFT949fUipzkiFOBH3fAiZZUCdYojwUyX2aTonS1aIwMrx6NUIsHfUHSLzjGJFxxsG72wAo9EWJR4yQWyJJaDb6rYcBtJvTvH3UoAS4JFNDaxGhmKNaMwgElLURlRFeVkLCjkfnXmWtINWZIrPGYq0-&format=source" alt="Discord logo" width="20" height="20" style="border-radius:20px;"> <b><a href="https://discord.gg/BgxvVqap4G" target="_blank">Join my discord</a> (fastest way to contact me) </b>

### <a href=".github/ISSUE_TEMPLATE/bug_report.md" target="_blank">🐛 Report a Bug</a>

### <a href=".github/ISSUE_TEMPLATE/feature_request.md" target="_blank">💡 Suggest a Feature</a>


## Chrome Web Store Statistics

<p align="center">
  <img src="https://img.shields.io/chrome-web-store/users/dnjjchajjdnfbjhjclmilicgheglcopj?style=for-the-badge&label=%E2%97%88%20ACTIVE%20USERS%20%E2%97%88&labelColor=white&color=white" alt="Chrome Users">
  <img src="https://img.shields.io/chrome-web-store/rating/dnjjchajjdnfbjhjclmilicgheglcopj?style=for-the-badge&label=%E2%97%88%20AVERAGE%20RATING%20%E2%97%88&labelColor=white&color=white" alt="Chrome Rating">
  <img src="https://img.shields.io/chrome-web-store/stars/dnjjchajjdnfbjhjclmilicgheglcopj?style=for-the-badge&label=%E2%97%88%20TOTAL%20RATINGS%20%E2%97%88&labelColor=white&color=white" alt="Chrome Stars">
</p>

## Firefox Add-on Statistics

<p align="center">
  <img src="https://img.shields.io/amo/users/newtube-youtubestylecustomizer?style=for-the-badge&label=%E2%97%88%20DAILY%20USERS%20%E2%97%88&labelColor=white&color=white" alt="Firefox Users">
  <img src="https://img.shields.io/amo/dw/newtube-youtubestylecustomizer?style=for-the-badge&label=%E2%97%88%20WEEKLY%20INSTALLS%20%E2%97%88&labelColor=white&color=white" alt="Firefox Weekly Installs">
  <img src="https://img.shields.io/amo/v/newtube-youtubestylecustomizer?style=for-the-badge&label=%E2%97%88%20LATEST%20VERSION%20%E2%97%88&labelColor=white&color=white" alt="Firefox Version Status">
</p>

## PREREQUISITES

- [bun](https://bun.sh/)
- [Firefox](https://www.firefox.com) (for web-ext testing)

## BUILD FROM SOURCE

1. **Clone & Enter:**

   ```bash
   git clone https://github.com/AzPepoze/NewTube
   cd NewTube
   ```

2. **Install Dependencies:**

   ```bash
   bun install
   ```

3. **Build:**

   ```bash
   bun run build
   ```

   The output will be in the `out/dist` directory.

## DEVELOPMENT

Run the extension in development mode with hot-reloading:

```bash
# For Chromium
bun run dev:chromium

# For Firefox
bun run dev:firefox
```

## CONTRIBUTING

Feel free to contribute to this project by opening issues or submitting pull requests.

> [!IMPORTANT]
> Please make sure select the target branch `dev` before submitting pull requests.

<div align="center">
  <a href="https://www.star-history.com/#AzPepoze/NewTube&type=date&legend=top-left">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=AzPepoze/NewTube&type=date&theme=dark&legend=top-left" />
      <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=AzPepoze/NewTube&type=date&legend=top-left" />
      <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=AzPepoze/NewTube&type=date&legend=top-left" width="600" />
    </picture>
  </a>
  <br>
  <br>
  <strong>✦ Made with ♥︎ by AzPepoze ✦</strong>
</div>
