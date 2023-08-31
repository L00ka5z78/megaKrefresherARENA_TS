import express, { static as eStatic, urlencoded } from 'express';
import 'express-async-errors';
import methodOverride from 'method-override';
import { engine } from 'express-handlebars';

const app = express();

app.use(methodOverride('_method'));
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(eStatic('public'));
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    //helpers: ???
  })
);
app.set('view engine', '.hbs');
app.get('/', (req, res) => {
  res.send('HIIII!');
});
// app.use(handleError)
app.listen(3000, 'localhost', () => {
  console.log('Server is ON and running on http://localhost:3000');
});
