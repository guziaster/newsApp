const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "f3f342144dff46569771644ceef85fd2";

app.get("/article", async (req, res) => {
  try {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    let last3DaysFullDate = getLast3DaysDate();
    let last3DaysDate = `${last3DaysFullDate.getFullYear()}-${last3DaysFullDate.getMonth()}-${last3DaysFullDate.getDate()}`;

    const { q, category, country, from, to } = req.query;
    const queryParameter = req.params.q;
    const categoryParameter = req.params.category;

    const dateFromParameter = from ? from : last3DaysDate;
    const dateToParameter = to ? to : currentDate;
    const sortingParameter = "popularity";

    let url = new URL("https://newsapi.org/v2/everything");
    if (q) {
      url.searchParams.append("q", q);
    } else if (category || country) {
      url = new URL("https://newsapi.org/v2/top-headlines");
      if (category) {
        url.searchParams.append("category", category);
      }
      if (country) {
        url.searchParams.append("country", country);
      }
    } else {
      url = new URL("https://newsapi.org/v2/top-headlines");
      url.searchParams.append("sources", "bbc-news");
    }
    url.searchParams.append("from", dateFromParameter);
    url.searchParams.append("to", dateToParameter);
    url.searchParams.append("sortBy", sortingParameter);
    url.searchParams.append("apiKey", API_KEY);

    const response = await axios.get(url);

    const articles = response.data.articles.map((article) => ({
      author: article.author || "",
      title: article.title || "",
      description: article.description || "",
      url: article.url || "",
      publishedAt: article.publishedAt || "",
      content: article.content || "",
      urlToImage:
        article.urlToImage ||
        "https://www.housingeurope.eu/image/163/sectionheaderpng/resourcesdef.png",
    }));
    res.json({ articles });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.response.data);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function getLast3DaysDate() {
  const now = new Date();

  return new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
}
