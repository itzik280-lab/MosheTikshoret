# משה תקשורת - אתר תדמית (Static Site)

אתר סטטי מלא בעברית (RTL) עבור **משה תקשורת** - פתרונות מיגון, אבטחה ותקשורת מתקדמים.
אין תלות בשרת, בבסיס נתונים או בתהליך build - פשוט מעלים את התיקייה כמו שהיא.

## מבנה הקבצים

```
/
├── index.html              דף הבית
├── about/index.html        אודות
├── services/index.html     שירותים (עוגנים: #cameras #alarms #intercom #access #network #maintenance)
├── projects/index.html     פרויקטים (כולל וידאו)
├── contact/index.html      צור קשר (טופס → WhatsApp)
├── 404.html                דף שגיאה
├── css/style.css           כל העיצוב (קובץ אחד)
├── js/main.js              כל האינטראקציות (קובץ אחד, ללא ספריות)
├── assets/                 תמונות, וידאו, אייקונים ופונטים (self-hosted)
├── robots.txt / sitemap.xml / site.webmanifest
└── README.md
```

## פריסה ל-GitHub Pages (מומלץ לבדיקה/סטייג'ינג)

האתר **אגנוסטי לנתיב הבסיס**: כל הנתיבים יחסיים, כך שהוא עובד ללא שינוי גם בשורש דומיין
(`user.github.io` / דומיין מותאם) וגם תחת תת-נתיב של ריפו (`user.github.io/repo/`).

1. צרו ריפו חדש והעלו את **תוכן** התיקייה הזו לשורש הריפו · כך ש-`index.html` נמצא ברמה העליונה
   (לא בתוך תיקייה פנימית! זו הסיבה הנפוצה ביותר לאתר "שבור").
2. Settings → Pages → Source: **Deploy from a branch** → Branch: **main** → Folder: **/(root)** → Save.
3. המתינו כדקה לבנייה. הכתובת תופיע באותו מסך.
4. קובץ `.nojekyll` כלול בפרויקט · אל תמחקו אותו (הוא מונע מ-GitHub להריץ עיבוד Jekyll מיותר).
5. **Cache:** GitHub Pages שומר קבצים בדפדפן לכ-10 דקות. אחרי כל עדכון בצעו רענון מלא
   (Ctrl+Shift+R / Cmd+Shift+R) לפני שמסיקים ש"משהו לא עובד".
6. דף `404.html` עצמאי לחלוטין (ללא קבצים חיצוניים) ומזהה לבד את נתיב הבסיס.
   במקרה קצה של user-site עם מבנה חריג אפשר לקבע ידנית: `<body data-site-base="/my-base/">`.

## פריסה לאחסון אחר

Netlify / Vercel / Cloudflare Pages / cPanel: מעלים את התיקייה כמו שהיא לשורש.
ב-Apache הגדירו `ErrorDocument 404 /404.html` ב-`.htaccess`; ב-Nginx: `error_page 404 /404.html;`.

## החלפת הדומיין

הקנוניקל, ה-Open Graph, הסכמות (JSON-LD) וה-sitemap מצביעים כרגע על:

```
https://www.moshe-tikshoret.co.il
```

אם הדומיין הסופי שונה - בצעו חיפוש-והחלפה (find & replace) של המחרוזת הזו **בכל הקבצים** (5 דפי HTML + sitemap.xml + robots.txt).

## עדכונים נפוצים

- **טלפון / WhatsApp:** חיפוש-והחלפה של `972546742162` ושל `054-6742162`.
- **שעות פעילות:** מופיעות בפוטר של כל דף, בעמוד צור קשר וב-JSON-LD (בית + צור קשר).
- **מספרי הסטטיסטיקה** (שנות ניסיון, התקנות): בדף הבית, סקשן "stats" - ערכי `data-count`.
- **וידאו פרויקט:** החליפו את `assets/intercom-project.mp4` ואת `assets/video-poster.jpg` (וידאו אנכי 9:16). עדכנו גם `uploadDate`/`duration` ב-JSON-LD של עמוד הפרויקטים.

## מה כלול מבחינת SEO

- תגית title + description ייחודיות לכל דף, canonical, Open Graph + Twitter Cards.
- JSON-LD: LocalBusiness, WebSite, FAQPage (בית), AboutPage, Service ×6, VideoObject, ContactPage, BreadcrumbList.
- sitemap.xml + robots.txt, כתובות נקיות, H1 יחיד בכל דף, alt לכל תמונה.
- פונטים בהתקנה עצמית (ללא Google Fonts), preload לפונטים קריטיים, lazy-loading לתמונות, וידאו ב-preload חסכוני.

בהצלחה! 🚀
