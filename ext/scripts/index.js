'use strict';

// Entry point
$(document).ready(Main());

function Main () {

    let puzzle = scrapePuzzle();

    // Append Sidebar and run helper methods as callback
    appendSidebar(function() {
        // Match ti-sidebar colors to current lichess theme
        matchStyles();
        // Inject Images because images require exact extension url
        injectImages();

        populateSidebar(puzzle);
    });

    // Get puzzle from Eve python API connect to a mongodb instance
    // getPuzzle(function(response) {
    //     populateSidebar(JSON.parse(resonse));
    // });
}

function appendSidebar(callback) {
    // Get exact url
    $.get(chrome.extension.getURL('/index.html'), function(data) {

        // Selectors
        let right = $("#puzzle .right")[0];
        let table = $(right).find(".table_wrap")[0];

        // Inject html from GET request
        $($.parseHTML(data)).appendTo(right);
        // Sidebar selector declared after it's appended to the document
        let sidebar = $("#ti-sidebar");
        // Append Lichess table to ti-sidebar
        $(table).appendTo(sidebar);

        callback();
    });
}

function injectImages() {
    // This function finds all img tags in #ti-sidebar and replaces the current 'src' attribute with an exact url
    // Because of this, I can add data-src="..." as I normally would but this 'fixes' them to the exact url
    $("#ti-sidebar img").each(function() {
        // this = current element
        let imgSrc = $(this).attr("data-src");
        $(this).attr("src", chrome.extension.getURL(imgSrc));
    });
}

function matchStyles () {

    let body = $('body');
    let background = $(body).css('background');
    let backgroundColor = $(body).css('background-color');

    // Check background of Lichess and set themeClass accordingly
    // "rgb(238, 238, 238)" is Lichess light theme backgroundColor
    let themeClass = (backgroundColor == "rgb(238, 238, 238)") ? "light" : "dark";

    $("#ti-sidebar").css({
        background: background,
        color: $(body).css('color')
    }).addClass(themeClass);

    $("#ti-header").addClass(themeClass);
    $("#ti-content").addClass(themeClass);
}

// Gets puzzle from database based on url
function getPuzzle(callback) {

    let re = new RegExp("[0-9]+");
    // A lot going on here. Here's a quick explanation
    // 1. Get the pathname: "training/1234"
    // 2. Match regex to id number string and run exec
    // 3. RegExp.exec returns array with format: [match, index, input]
    // 4. Parse number from exec match (exec[0])
    let puzzleID = parseInt(re.exec(window.location.pathname)[0]);

    chrome.runtime.sendMessage({
        method: 'GET',
        action: 'xhttp',
        url: 'http://localhost:5000/puzzles/' + puzzleID
    }, callback);

}

function populateSidebar (puzzle) {
    console.log(puzzle);
    
    $("#ti-rating").text(puzzle.rating);

    let colors = ["White", "Black"];
    let color = (puzzle.color == "white") ? 0 : 1; 
    $("#ti-to-play").text(colors[color]);
    // Colors array used so that I can toggle classes regardless of sidebar state
    $("#ti-content piece").addClass(colors[color].toLowerCase());
    $("#ti-content piece").removeClass(colors[(color + 1) % 2].toLowerCase());
}

function scrapePuzzle() {
    // Take puzzle from script at bottom of document
    let re = new RegExp("{\"puzzle\":{.*");
    let result;
    // Search through scripts till exec finds a match to the regex
    $("script").each(function() {
        let match = re.exec(this.innerText);
        // A proper match was found
        if (!!match) {
            // remove an extra "," from the end so it can be parsed to JSON
            let matchObjString = match[0].substr(0, match[0].length - 1);
            result = JSON.parse(matchObjString).puzzle;
        }
    });

    return result;
}