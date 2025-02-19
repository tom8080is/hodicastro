const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

async function getFacebookAdMedia(adPreviewUrl) {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: "new",
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
            args: [
                "--no-sandbox", 
                "--disable-setuid-sandbox", 
                "--disable-dev-shm-usage", 
                "--disable-accelerated-2d-canvas", 
                "--disable-gpu",
                "--single-process"
            ] 
        });

        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        await page.goto(adPreviewUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

        const videoElement = await page.$('video');
        if (videoElement) {
            const videoSrc = await page.evaluate(video => video.src, videoElement);
            return { type: 'video', src: videoSrc };
        }

        const imgElement = await page.$('img');
        if (imgElement) {
            const imgSrc = await page.evaluate(img => img.src, imgElement);
            return { type: 'image', src: imgSrc };
        }

        return { error: 'לא נמצא מדיה בפרסומת' };
    } catch (error) {
        console.error("🔥 שגיאה במהלך שליפת המדיה:", error);
        return { error: 'שגיאה בטעינת העמוד', details: error.message };
    } finally {
        if (browser) await browser.close();
    }
}

app.post('/fetch-media', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'חסר קישור' });

        console.log(`🔍 קבלת בקשה ללינק: ${url}`);
        const media = await getFacebookAdMedia(url);
        res.json(media);
    } catch (error) {
        console.error("🔥 שגיאה בשרת:", error);
        res.status(500).json({ error: 'שגיאה פנימית בשרת', details: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
