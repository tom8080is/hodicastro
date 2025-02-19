# שימוש בגרסת Node.js יציבה עם תמיכה בפאפטיר
FROM node:18-slim

# עדכון המאגרים והתקנת חבילות Puppeteer הדרושות
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# משתני סביבה למנוע הורדה מחדש של Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# יצירת תיקיית עבודה
WORKDIR /app

# התקנת התלויות של Node.js
COPY package.json ./
RUN npm install

# העתקת קבצי הקוד
COPY . .

# הפעלת השרת
CMD ["npm", "start"]
