const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'f3f342144dff46569771644ceef85fd2';

app.get('/articles', async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=${API_KEY}`);
    const articles = response.data.articles.map(article => ({
      author: article.author || '',
      title: article.title || '',
      description: article.description || '',
      url: article.url || '',
      publishedAt: article.publishedAt || '',
      content: article.content || '',
      urlToImage: article.urlToImage || 'https://www.housingeurope.eu/image/163/sectionheaderpng/resourcesdef.png'
    }));
    res.json({ articles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
