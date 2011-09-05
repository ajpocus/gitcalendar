**OVERVIEW**

Gitcalendar pulls down your GitHub commit data, and crosses off each day you've made a commit on a calendar. This project was inspired by [this Lifehacker article about Jerry Seinfeld](http://lifehacker.com/281626/jerry-seinfelds-productivity-secret).

**REQUIREMENTS**

Gitcalendar requires django-debug-toolbar, which you can install with pip:

    $ pip install django-debug-toolbar

**USAGE**

You'll have to edit settings.py, and replace the value of USER with your username. Start the server with:

    $ ./manage.py runserver

and you can see your calendar at http://localhost:8000/.

**AUTHORS**

Gitcalendar is written by Austin Pocus, copyright 2011, under the BSD license. Details may be found in LICENSE.

    
