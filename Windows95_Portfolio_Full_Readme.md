
# 🖥️ Windows 95 Portfolio — By Ekansh Agarwal  
### _“Whatever your mom like to call me”_  

A fully interactive Windows-95–style portfolio website built using **Next.js**, **React**, **TypeScript**, and **Tailwind CSS** — complete with draggable windows, classic games, a working Start Menu, wallpaper changer, resume download, and more.

---

## 👤 **Author Details**

| Field | Info |
|-------|------|
| **Name** | Ekansh Agarwal |
| **Title** | Whatever your mom like to call me |
| **Email** | ekanshagarwal9090@gmail.com |
| **GitHub** | https://github.com/ekasnh |
| **LinkedIn** | https://www.linkedin.com/in/ekansh-agarwal01/ |
| **Google Scholar** | https://scholar.google.com/citations?user=xDg34AYAAAAJ&hl=en&authuser=1 |

---

# 🖼️ Live Features

## ✔️ Windows 95 Desktop  
- Draggable app windows  
- Start Menu with functional items  
- Desktop icons with double-click open  
- Classic Win95 styling and sound cues  
- Real window controls (minimize, maximize, close)

---

## 🎨 Wallpaper Changer  
Located in:  
**Start → Settings → Change Wallpaper**

Features:
- Next / Previous wallpaper buttons  
- Instantly updates desktop  
- Wallpapers stored in `/public/wallpapers/`

---

## 📄 Resume (Auto Download)
Available in:
- **Start Menu → Documents → Download Resume**  
- **Portfolio Window → Download Resume button**

Resume source text comes directly from the uploaded resume text file.  

---

# 🎮 Included Games

### 1. 🧨 Minesweeper — Fully Playable  
### 2. 🧱 Tetris — Full Engine  
### 3. ♠️ Solitaire — Full Klondike  
### 4. 🏓 Pong — Paddle + Ball Physics  
### 5. ♟️ Chess — Legal Move Engine  

Every game opens inside a draggable Windows 95 window.

---

# 📦 Project Structure

```
/app
  layout.tsx
  page.tsx
  globals.css

/components
  Desktop.tsx
  Taskbar.tsx
  WindowFrame.tsx
  Icon.tsx
  /games
    Minesweeper.tsx
    Chess.tsx
    Tetris.tsx
    Pong.tsx
    Solitaire.tsx

/public
  favicon.svg      
  resume.pdf
  /wallpapers
  /icons

next.config.mjs
package.json
pnpm-workspace.yaml
tailwind.config.ts
postcss.config.mjs
tsconfig.json
vercel.json
```

---

# 🚀 Running locally

```bash
pnpm install
pnpm dev
```

Visit:  
`http://localhost:3000`

---

# ☁️ Deploying on Vercel

Add env variable if needed:

```
PNPM_ALLOW_NON_ROOT_BUILD = true
```

Project is already Vercel-ready.

---

# 📚 Projects Shown in Portfolio

1. **Gigid-gigid-learn Python**  
2. **ShardVault**  
3. **Inferometer**  
4. **Windows 95 Portfolio**  

---

# 📘 Licenses

## MIT License
```
MIT License
Copyright (c) 2025 Ekansh Agarwal

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

---

## Creative Commons BY-NC-SA 4.0 License  
```
This work is licensed under the Creative Commons 
Attribution-NonCommercial-ShareAlike 4.0 International License.
```

---

# 💬 Credits
- Windows 95 UI inspiration from classic Microsoft OS  
- Custom implementation by Ekansh Agarwal  

---

# 🏁 Final Notes
This retro OS portfolio is fully customizable and expandable.
