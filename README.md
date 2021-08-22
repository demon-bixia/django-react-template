## About 📝

<p>
A react project template to use with django. exports react 
builds to django project with js and css files embedded as static template tags.
so you can server react using django!
</p>

## Features ⚡

- [x] serve react using django.

- [x] development server.

- [x] typescript support.

- [x] sass support.

- [x] multiple webpack configs using merge.

## Installation 🛫

Clone the repo

```bash
git clone https://github.com/MuhammadSalahAli/django-react-template.git
```

Enter the client folder

```bash
cd django-react-template/client/
```

To change the django project location put the absolute path of your django project base directory. or you can use the
default django project.

```json
{
  "build": "webpack --env production --env DjangoProject=/home/muhammad/Documents/Projects/Personal/Web/django-react-template/server"
}
```

Install client dependencies

```bash
yarn install
```

Start dev server

```bash
yarn run start
```

Build the client code and export it to your django project

```bash
yarn run build
```

Enter the server directory

```bash
cd django-react-template/server/
```

Install server dependencies

```bash
pipenv install
```

Enable the virtual environment

```bash
pipenv shell
```

Run the django server

```bash
python manage.py runserver
```

Visit <a href="localhost:8000">localhost</a> to see django serving your React application. 
