<h1 align="center">
    Webpack config for working with django and react
</h1>

### Features

- [x] {% static %} tag insertion
- [x] development server
- [x] minify on production
- [x] Jest Support
- [x] TypeScript support
- [x] Scss support
- [x] post css support
- [x] testing-library support

### How it works
<p>
This webpack config uses ejs template engine to insert the static django template language tag in the index.html that
React uses. building will export the js/css files to assets/css and assets/js directory in the django project root
directory, and the html files to template/.
</p>

### How to use it

Clone the repo

```bash
git clone https://github.com/MuhammadSalahAli/django-react-template.git
```

Enter the project's folder

```bash
cd django-react-template/
```

Enter the client folder

```bash
cd client/
```

In package.json build script change DjangoProject to your django app project directory.

```json
{
  "build": "webpack --env production --env DjangoProject=/home/muhammad/Documents/Projects/Personal/Web/django-react-template/server"
}
```

Install dependencies

```bash
yarn install
```

Or

```bash
npm install
```

To run the client dev server

```bash
yarn run start
```

To build the client code and export to django project

```bash
yarn run build
```
