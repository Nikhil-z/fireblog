FireBlog
========

A minimalistic blogging platform that will run anywhere! Wouldn't it be cool if you could have a blog that would run on any server, without a fixed base whose engine you could easily modify using just HTML, CSS and Javascript? 

Well then. You've come to the right place.

Fireblog is highly extensible, customisable, secure and lightweight blogging engine, built using Firebase and AngularJS. It's designed to be super easy to setup and use.

===

## Features
### Markdown Editor + Live Preview  
You write your FireBlog posts using Markdown which Fireblog will turn that into HTML when you hit the publish button. You get a live preview of the resulting HTML while you type. This makes writing posts a breeze.

### Clever Drafts
Every time you take a brief pause from typing, your post will be saved to both the server and locally, meaning that you can quickly transfer to continue writing on another device, or continue working on your post after you close your window even if you are offline.

### URL slugs
After publishing, Fireblog turns your post's title into a slug that acts as a suffix for making readable post URLs. For example `Dan's Awesome Blog` will become `dans-awesome-blog`.

### Flexible Configuration
All your configuration goes in the `config.js` file, this enables you to quickly and easily change themes, the name of your blog or add as many meta details as you wish.

## Firebase

FireBlog uses [Firebase](https://www.firebase.com/) as a backend, meaning that you don't have to do any server side setup yourself. It's the key component in enabling FireBlog to be detached from the server. Your configuration, theming and editing is all done client side, then Firebase handles authentication and data storage. It's as simple as that. 

## Installation

To set up a copy of FireBlog
 - Clone this repository
 - Create a Firebase
 - Update your Firebase URL in config.js
 - Change your Firebase Auth rules to:

```js
{
  ".read": true
  ".write": "auth !== null"
}
```
 - Modify the name of your blog in config.js
 - Host locally or put it on a server
 - Enjoy.
 
The free Firebase plan should be sufficient for most users of FireBlog.

## Your First Post

Navigate to your blog and prefix admin to the URL. E.g.
[http://my-awesome-fireblog.com/admin](http://this-goes-nowhere.com)


## Themes
Creating and modifying themes for Fireblog is seriously easy.

Let's have a look at how we create a simple theme.

Create a new folder in the root of your blog

`your-blog/some-theme-name`

In here, we'll need 3 files.

 - Your main page template: `template.html`
 - Post page template: `post.html`
 - Stylesheet: `index.css`

Both the HTML templates use [AngularJS](http://angularjs.org) for interpolation. If you don't know Angular, don't worry, you only need to use a tiny amount of Angular stuff, and it's dead easy to learn. Let's make a simple template for our main page.

```html
<h1>{{name}}</h1>
<ul>
  <li ng-repeat='post in posts'>
    <a href='{{post.url}}'><h3>{{post.title}}</h3></a>
    <h6>{{post.date.day}}/{{post.date.month}}/{{post.date.year}}</h6>
    <div ng-bind-html='{{post.content}}'></div>
  </li>
</ul>

```

And that's it. That's all we need to show all of our blog posts on our main page. Any styles found in `some-theme-name/index.css` will be automatically applied to your page.

You can use any of the properties you have defined within `config.js` in here. For example, let's add a new property within our config file.

```
{
  ...
  author: "Dan Prince"
  ...
}
```

Now we can access that value from within our theme with the curly brace syntax like this: `{{author}}`

The `posts.html` file is similar, except that you no longer have access to the `posts` object, only the details for the post who's page you are on. Check out the default theme for more ideas.
