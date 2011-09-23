import urllib2
import json
import time
from datetime import date
from iso8601 import parse_date

from django.core.cache import cache
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.template import RequestContext

from gitcalendar import settings

user = settings.USER
urlbase = "https://api.github.com"

def get_repos(request):
    # I use an underscore prefix in case someone has a repo named "repos"
    repos = cache.get('_repos')

    if not repos:
	repourl = ''.join([urlbase, "/users/" + user + "/repos"])
	repo_req = urllib2.Request(repourl)
	opener = urllib2.build_opener()
	repo_f = opener.open(repo_req)
	repos = repo_f.read()
	cache.set('_repos', repos)

    return HttpResponse(repos, mimetype="application/json")

def get_commits(request):
    if 'repo' in request.GET:
	repo = request.GET.get('repo')
    else:
	raise Http404

    commit_list = cache.get(repo)

    if not commit_list:
	commiturl = ''.join([urlbase, '/repos/', user, '/', repo, "/commits"])
	commit_req = urllib2.Request(commiturl)
	opener = urllib2.build_opener()
	commit_f = opener.open(commit_req)
	commits = json.loads(commit_f.read())

	commit_list = []
	for commit in commits:
	    if commit['author']['login'] == "ajpocus":
		entry = {}
		timestring = commit['commit']['author']['date']
		entry['timestamp'] = time.mktime(
		    parse_date(timestring).timetuple())
		entry['repo'] = repo
		entry['message'] = commit['commit']['message'][:50]
		if len(entry['message']) == 50:
		    entry['message'] += '...'

		commit_list.append(entry)
	cache.set(repo, commit_list)

    return HttpResponse(json.dumps(commit_list), mimetype="application/json")

def view_calendar(request):
    c = RequestContext(request)
    return render(request, 'main/calendar.html', context_instance=c)

