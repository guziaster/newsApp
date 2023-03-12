const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "f3f342144dff46569771644ceef85fd2";
//"https://newsapi.org/v2/everything?q=test&from=2023-02-10&to=2023-03-12&sortBy=relevancy&apiKey=715dc191ff584bb2b070568ffb2d6683"
app.get("/articles/:query?", async (req, res) => {
  try {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth();
    let lastMonth = date.getMonth() - 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    let lastMonthDate = `${year}-${lastMonth}-${day}`;
    const parameter = req.params.query;
    var response;
    if (parameter) {
      response = await axios.get(
        `https://newsapi.org/v2/everything?q=${parameter}&from=${lastMonthDate}to=${currentDate}&sortBy=relevancy&apiKey=715dc191ff584bb2b070568ffb2d6683`
      );
    } else {
      response = await axios.get(
        `https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${API_KEY}`
      );
    }

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
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
