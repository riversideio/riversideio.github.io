<img src="https://raw.githubusercontent.com/riversideio/riversideio.github.com/master/riversideio.png" alt="Riverside I/O" width="140" />

# Riverside.io 

```
git clone https://github.com/riversideio/riversideio.github.com.git
cd riversideio.github.com
jekyll serve
```

### How to Edit

```
make sure to fork this repo
then make a pull request with new information
```
 
The idea behind this site is to allow any member to edit the site. There of course is a few things that need to be learned before editing

#### Structure

Lets say you would like to edit a typo on the home/landing page. The way you would do that is to go to the look at the `index.html` file in the root directory. in there you can see alot of `{{tags}}` that look like this. Inside of those is paths. So the way the paths work is there is a variable called `site` injected into every template, and that has a path that points towards data. The contents of data can be found in the `_data` directory. So you find the variable you want to change it is `site.data.landing.subheader`. From the path we can then know that the file is.

```
. > _data > landing.yml
```
and inside of that file you will find a key with that looks like `subheader:` and the content right after that will be the content you would like to edit. [Read More about YML](http://en.wikipedia.org/wiki/YAML)

##### Post / Pages

Some of the extra pages are not found in the index template, they are stand alone files inside the `_post` folder. Inside here the pages are more human readable then `<html>` the technology is call [Markdown](http://en.wikipedia.org/wiki/Markdown). This is a great way to create a new page, and if you doning this directly from [Github](http://github.com) you can use their built in Markdown Editor, that has live preview as well. The naming convention is `year-month-day-title.markdown` if you try to submit a file without that convention 'Jekyll' will not pick it up.

### How to Contribute

Contributing is the same thing as Editing but I broke it off into another section due to the extra level of techanical skill needed for full HTML, CSS, and Template editing.

#### Installing Dependecies

##### This is all in Terminal or Command Prompt

You will need [Ruby](https://www.ruby-lang.org/en/downloads/) & [Ruby Gems](http://rubygems.org/pages/download), instructions to install are on that site. Once those are installed you will need `Jekyll`.

```
gem install jekyll
```
Now that you have Jekyll, you can build up new templates and edit everything on the site including styles and layout. To do that run.

```
jekyll build 
```

then to preview the site just run

```
jekyll serve
```

Then visit `localhost:4000` and the site should be there if not check for errors in you terminal.

##### CSS precompiler

We are using `sass` as a precompiler, nothing bleeding edge so  any newer version will suffice, to install run.

```
gem install sass
```

then when you want to compile the sass files in the root directory run

```
sass css/sass/main.scss:css/main.css 
```

##### Notes about Javascript

We are using [require.js](http://requirejs.org/) to modulize our scripts, to include a script require into the top of `main.js`, and require it where needed. Please read documentation to see how to create `amd modules`.
