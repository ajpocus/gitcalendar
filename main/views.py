import urllib2
import json
import time
from datetime import date
from iso8601 import parse_date

from django.core.cache import cache
from django.http import HttpResponse
from django.shortcuts import render
from django.template import RequestContext

from gitcalendar import settings

def get_data(request):
    user = settings.USER
    urlbase = "https://api.github.com"
    repourl = ''.join([urlbase, "/users/" + user + "/repos"])

    commit_list = cache.get('commit_list')
    today = date.today()

    if commit_list:
	commit_dates = (date.fromtimestamp(commit['timestamp'])
	    for commit in commit_list)

	if today in commit_dates:
	    reload_cache = False
	else:
	    reload_cache = True
    else:
	reload_cache = True

    if reload_cache:
	commit_list = []
        repo_req = urllib2.Request(repourl)
        opener = urllib2.build_opener()
        repo_f = opener.open(repo_req)
        repos = json.loads(repo_f.read())

        for repo in repos:
            commiturl = ''.join([urlbase, "/repos/ajpocus/", repo['name'],
		"/commits"])
	    commit_req = urllib2.Request(commiturl)
	    commit_f = opener.open(commit_req)
	    commits = json.loads(commit_f.read())

	    for commit in commits:
		if commit['author']['login'] == "ajpocus":
		    entry = {}
		    timestring = commit['commit']['author']['date']
		    entry['timestamp'] = time.mktime(
			parse_date(timestring).timetuple())
		    entry['repo'] = repo['name']
		    entry['message'] = commit['commit']['message'][:50]
		    if len(entry['message']) == 50:
			entry['message'] += '...'

		    commit_list.append(entry)
	cache.set('commit_list', commit_list)	

    return HttpResponse(json.dumps(commit_list), mimetype="application/json")

def view_calendar(request):
    c = RequestContext(request)
    return render(request, 'main/calendar.html', context_instance=c)

