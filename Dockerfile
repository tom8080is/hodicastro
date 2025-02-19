FROM node:18

# התקנת Puppeteer + תלות במערכת
RUN apt-get update && apt-get install -y \
    libgobject-2.0-0 \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    libx11-xcb1 \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# התקנת Puppeteer ללא הורדת Chrome כל פעם מחדש
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
