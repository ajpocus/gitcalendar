$(function () {
  function generateCalendars () {
    var cals = $(".calendar");
    var year = (new Date).getFullYear();
    for (var i = 0; i < cals.length; i++) {
      $(cals[i]).datepicker({ defaultDate: new Date(year, i) });
    }
  }

  function markCalendars () {
    $.getJSON("http://localhost:8000/data", function (commitList) {
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

	var dupQuery = query + " .cross-out";
	var dups = $(dupQuery);
	if (dups.length !== 0) {
	  continue;
	}

	var pos = box.position();
	var crossout = $("<span>x</span>").hide().addClass(
	  "cross-out").css(
	  "top", pos.top-14).css(
	  "left", pos.left+5).show();

	(function () {
	  var info = $("<div></div>").hide().addClass(
	    "info").css(
	    "top", pos.top+10).css(
	    "left", pos.left+30);
	  var repo = $("<span></span>").hide().append(
	    commit.repo).addClass(
	    "repo");
	  var message = $("<span></span>").hide().append(
	    commit.message).addClass(
	    "message");
	  crossout.hover(function () {
	    info.append(repo);
	    info.append(message);
	    crossout.after(info);
	    info.show();
	    repo.show();
	    message.show();
	  }, function () {
	    message.hide();
	    repo.hide();
	    info.hide();
	  });
	})()
	box.append(crossout);
      }
    });
  }

  (function init () {
    generateCalendars();
    markCalendars();
  })();
});
