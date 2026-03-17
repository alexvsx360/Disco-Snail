# 🐌 Disco Snail Adventure

**משחק פלטפורמה דינמי בדפדפן** – חלזון דיסקו יוצא להרפתקה דרך עולמות שונים, בוסים, כוחות מיוחדים ועוד!

---

## 🎮 שחק עכשיו

**[▶️ שחק ב-GitHub Pages](https://alexvsx360.github.io/Disco-Snail/)** *(לאחר העלאה ל-GitHub)*

---

## 📖 תיאור

Disco Snail Adventure הוא משחק פלטפורמה קלאסי בסגנון Mario, עם חלזון דיסקו כגיבור. המשחק כולל:

- **עולמות מרובים**: אוברוורלד, ביוב, חלל, מים ועוד
- **בוסים**: תיקן, יתוש חלל, קקטוס, מדוזה ועוד
- **כוחות מיוחדים**: אש, אדמה, מים, רוח, קרח, ברק, טבע, אבן, צל, אור ועוד
- **מערכת חמצן** בעולם המים
- **מוזיקת דיסקו** ופאוור-אפים

---

## 🕹️ בקרות

| מקש | פעולה |
|-----|-------|
| `←` `→` | תנועה שמאל/ימין |
| `↑` `↓` | כניסה לצינורות (מעלה/מטה) |
| `Space` | קפיצה |
| `X` | ירי (פאוור-אפ) |
| `C` | אבן ענק (רמה 5) |
| `P` | השהה |
| `R` | התחל מחדש |

תמיכה מלאה ב-**בקרות מגע** למכשירים ניידים.

---

## 📱 התקנה אופליין בטאבלט

המשחק תומך ב-**PWA** (Progressive Web App) – ניתן להתקין אותו על המסך הראשי ולשחק **בלי אינטרנט**.

### הוראות התקנה

1. **פתח את המשחק** בדפדפן (Chrome או Safari) כשהטאבלט מחובר לאינטרנט:
   - https://alexvsx360.github.io/Disco-Snail/

2. **שחק כמה דקות** – כך יישמרו קבצי הצלילים במטמון (cache).

3. **הוסף למסך הראשי**:
   - **Chrome (אנדרואיד)**: ⋮ תפריט → "הוסף למסך הבית" / "Add to Home screen"
   - **Safari (iPad)**: כפתור השיתוף ↑ → "הוסף למסך הבית" / "Add to Home Screen"

4. **הפעל את האייקון** – המשחק ייפתח כאפליקציה ויעבוד גם **אופליין**.

> **טיפ:** הפעל את המשחק פעם אחת כשיש חיבור לאינטרנט, כדי שכל הקבצים יישמרו. אחרי זה אפשר לשחק בלי רשת.

---

## 📁 מבנה הפרויקט

```
Disco-Snail/
├── index.html          # דף המשחק הראשי
├── style.css           # עיצוב המשחק וה-UI
├── js/
│   ├── globals.js      # קבועים, משתנים גלובליים, ערכות נושא
│   ├── utils.js        # צלילים, פונקציות עזר
│   ├── classes.js      # Player, Enemy, PowerUp, Pipe וכו'
│   ├── levels.js       # יצירת מפות, ביוב, צינורות, התנגשויות
│   ├── bosses.js       # חדרי בוסים (תיקן, יתוש, קקטוס)
│   └── main.js         # לולאת המשחק, HUD, מצבי משחק
├── sound/              # אפקטי קול ומוזיקה
├── manifest.json       # PWA – התקנה אופליין
├── sw.js               # Service Worker – מטמון לפעולה אופליין
├── LICENSE             # MIT License
└── README.md           # תיעוד זה
```

### תיאור קבצי JavaScript

| קובץ | תפקיד |
|------|-------|
| `globals.js` | GRAVITY, FRICTION, כוחות, מפות TILE, מצבי משחק, בוסים |
| `utils.js` | `playSound`, `preloadSounds`, פונקציות רנדום ו-URL |
| `classes.js` | Player, DiscoSnailSister, Platform, PowerUp, Enemy, Coin, Pipe |
| `levels.js` | יצירת מפות (TILE_LEGEND), ביוב, צינורות, חלקיקים |
| `bosses.js` | `enterBossRoom`, `enterSpaceBossRoom`, `enterCactusBossRoom` |
| `main.js` | `init`, `update`, `draw`, HUD, מעברי מצבים |

---

## 🚀 הרצה מקומית

1. **שיבוט** (או הורדת הפרויקט):
   ```bash
   git clone https://github.com/alexvsx360/Disco-Snail.git
   cd Disco-Snail
   ```

2. **הרצה** – פתח את `index.html` בדפדפן, או השתמש בשרת מקומי:
   ```bash
   npx serve .
   # או: python -m http.server 8000
   ```

3. גלוש ל־`http://localhost:3000` (או הכתובת שהשרת מציג).

---

## 📤 פרסום ב-GitHub Pages

### שלב 1: העלאה ל-GitHub

1. צור ריפו חדש ב-GitHub בשם `Disco-Snail`
2. חבר את הריפו המקומי:
   ```bash
   git remote add origin https://github.com/alexvsx360/Disco-Snail.git
   git branch -M main
   git push -u origin main
   ```

### שלב 2: הפעלת GitHub Pages

1. היכנס לריפו ב-GitHub
2. **Settings** → **Pages**
3. תחת **Source** בחר: **Deploy from a branch**
4. תחת **Branch** בחר: `main` ותיקייה `/ (root)`
5. שמור – GitHub יבנה את האתר אוטומטית

### קישור לאתר

לאחר ההפעלה, המשחק יהיה זמין בכתובת:

**https://alexvsx360.github.io/Disco-Snail/**

*(החלף `alexvsx360` בשם המשתמש שלך ב-GitHub)*

---

## 📜 רישיון

הפרויקט תחת [MIT License](LICENSE). © 2026 alexvsx360

---

## 🎵 קרדיטים

- מוזיקת דיסקו: *Disco Snails* – Vulfmon & Zachary Barker
- אפקטי קול: קבצי WAV/MP3 מתוך הפרויקט
