$(function () {
  function generateCalendars () {
    var cals = $(".calendar");
    var year = (new Date).getFullYear();
    for (var i = 0; i < cals.length; i++) {
      $(cals[i]).datepicker({ defaultDate: new Date(year, i) });
    }
  }

  function getCommitList () {
    var urlbase = "https://api.github.com";
    var user = "ajpocus";
    var repourl = urlbase + "/users/" + user + "/repos";
    var commiturl;
    var repos = [];
    var commitList = [];

    // get list of user's repositories
    $.getJSON(repourl, function getRepos (repolist) {
      repolist.forEach(function (repo) {
        repos.push(repo.name);
      });
    });

    // for each repo, append commits to commitlist
    repos.forEach(function (repo) {
      commiturl = urlbase + "/repos/" + user + repo + "/commits";
      $.getJSON(commiturl, function getCommits (commit) {
	if (author.login === user) {
	  commitList.push(commit.author.date);
	}
      });
    });

    return commitList
  }

  function markCalendars (commitList) {
    var day = $("a:contains('28')");
    var pos = day.position();
    var crossout = $("<span>x</span>").hide().addClass(
      "cross-out").css(
      "top", pos.top-14).css(
      "left", pos.left+5).show();
    day.append(crossout);
  }

  (function init () {
    var commitList;
    if (Modernizr.localstorage) {
      generateCalendars();
      if (localStorage["commitList"]) {
        commitList = localStorage["commitList"];
// TODO: check commitList for a commit made today
      } else {
	commitList = getCommitList();
      }
      markCalendars(commitList);
    } else {
      var error = $("<p>Sorry, you need a browser with localStorage.</p>");
      $(body).append(error);
    }
  })();
});
