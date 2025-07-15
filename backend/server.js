const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () =>
    console.log(`Server available on port ${PORT}`)
  );
}).catch((err) => {
  console.error('DB issue: ', err.message);
});
