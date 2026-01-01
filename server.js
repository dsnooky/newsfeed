const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");

const app = express();
app.use(cors());

const RSS_URL = "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en";

app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(RSS_URL);
    const parsed = await xml2js.parseStringPromise(response.data);

    const items = parsed.rss.channel[0].item.slice(0, 12);

    const news = items.map(item => ({
      title: item.title[0],
      link: item.link[0],
      source: item.source?.[0]._ || "Google News",
      published: item.pubDate[0],
      description: item.description?.[0] || ""
    }));

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to load Google News RSS" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Google News backend running on http://localhost:${PORT}`);
});
