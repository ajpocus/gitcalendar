$(function () {
  function generateCalendars () {
    var cals = $(".calendar");
    var year = (new Date).getFullYear();
    for (var i = 0; i < cals.length; i++) {
      $(cals[i]).datepicker({ defaultDate: new Date(year, i) });
    }
  }

  function markCalendars () {
    $.getJSON("http://localhost:8000/data", function (rawCommits) {
      var now = new Date();
      // convert to actual Date objects for method access
      // multiply by 1000 to convert to ms
      var commitDates = rawCommits.map(function (d) {
	return new Date(d*1000);
      });
      // ignore commits not of this year
      var commitList = commitDates.filter(function (d) {
	return d.getFullYear() === now.getFullYear();
      });

      for (var i = 0; i < commitList.length; i++) {
	var commit = commitList[i];
	var month = commit.getMonth().toString(10);
	var date = commit.getDate().toString(10);
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
	box.append(crossout);
      }
    });
  }

  (function init () {
    generateCalendars();
    markCalendars();
  })();

/* skip the whole init for now (incl. caching)
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
*/
});
