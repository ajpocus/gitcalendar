import urllib2
import json

from django.http import HttpResponse
from django.shortcuts import render

def get_data(request):
    urlbase = "https://api.github.com"
    repourl = ''.join([urlbase, "/users/ajpocus/repos"])
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
		commit_list.append(commit['commit']['author']['date'])

    return HttpResponse(json.dumps(commit_list), mimetype="application/json")

