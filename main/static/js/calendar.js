$(function () {
  function generateCalendars () {
    var cals = $(".calendar");
    var year = (new Date).getFullYear();
    for (var i = 0; i < cals.length; i++) {
      $(cals[i]).datepicker({ defaultDate: new Date(year, i) });
    }
  }

  function markCalendars () {
    $.getJSON("http://localhost:8000/repos/", function (repoList) {
      repoList.forEach(function (repo) {
	var url = "http://localhost:8000/commits/?repo=" + repo['name'];
	$.getJSON(url, function (commitList) {
	  var now = new Date();
	  // convert to actual Date objects for method access
	  // multiply by 1000 to convert to ms
	  commitList.forEach(function (commit) {
	    commit.timestamp = new Date(commit.timestamp*1000);
	  });

	  // ignore commits not of this year
	  var commitList = commitList.filter(function (d) {
	    return d.timestamp.getFullYear() === now.getFullYear();
	  });

	  for (var i = 0; i < commitList.length; i++) {
	    var commit = commitList[i];
	    var timestamp = commit.timestamp;
	    var month = timestamp.getMonth().toString(10);
	    var date = timestamp.getDate().toString(10);
	    var query = "#" + month + " a:contains('" + date + "')";

	    var box = $(query);
	    // multiple results returned for single-digit dates
	    if (box.length > 1) {
	      // only use the first element
	      box = box.eq(0);
	    }

	    // avoid duplicate cross-outs
	    if (box.find('.cross-out').length !== 0) {
	      continue;
	    }

	    var pos = box.position();
	    var crossout = $("<span>x</span>").hide().addClass(
	      "cross-out").css(
	      "top", pos.top-14).css(
	      "left", pos.left+5).show();

	    (function () {
	      var info = box.parent().find('.info').eq(0);
	      if (info.length === 0) {
		info = $("<div></div>").hide().addClass(
		  "info").css(
		  "top", pos.top+10).css(
		  "left", pos.left+30);
	      } else {
		info = info.eq(0);
	      }

	      var repo = $("<span></span>").hide().append(
		commit.repo).addClass(
		"repo");
	      var message = $("<span></span>").hide().append(
		commit.message).addClass(
		"message");
	      info.append(repo);
	      info.append(message);
	  
	      crossout.hover(function () {
		info.show();
		info.children().show()
	      }, function () {
		info.children().hide()
		info.hide();
	      });
	      box.append(crossout);
	      crossout.after(info);
	    })();
	  }
	});
      });
    });
  }

  (function init () {
    generateCalendars();
    markCalendars();
  })();
});
