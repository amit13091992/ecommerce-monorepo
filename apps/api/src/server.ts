import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
