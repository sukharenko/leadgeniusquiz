(function() {

    function shortenLargeNumber(num, digits = 1) {
        var units = [
                'k',
                'M',
                'G',
                'T',
                'P',
                'E',
                'Z',
                'Y'
            ],
            decimal;
        for (var i = units.length - 1; i >= 0; i--) {
            decimal = Math.pow(1000, i + 1);
            if (num <= -decimal || num >= decimal) {
                return + (num / decimal).toFixed(digits) + units[i];
            }
        }
        return num;
    }

    const redditURL = "https://www.reddit.com/";
    let topStoriesContainer = $("#topBody");
    let template = $(".topTemplate").html();

    $.ajax({
        url: "https://www.reddit.com/top.json",
        data: {
            count: 20
        }
    }).done(function(json) {
        let listingsHTML = "";
        let listings = json.data.children;
        listings.forEach(function(child) {
            let storyData = child.data;
            let story = template;
            story = story.replace(/{{title}}/g, storyData.title)
				.replace(/{{permalink}}/g, redditURL + storyData.permalink)
				.replace(/{{thumbnail}}/, storyData.thumbnail.match(/^http/)
				? storyData.thumbnail
                : "images/default.png")
				.replace(/{{submittime}}/, moment.unix(storyData.created_utc).local().from())
				.replace(/{{author}}/, storyData.author)
				.replace(/{{authorlink}}/, redditURL + "/user/" + storyData.author)
				.replace(/{{subreddit}}/, storyData.subreddit)
				.replace(/{{subredditlink}}/, redditURL + storyData.subreddit_name_prefixed)
				.replace(/{{commentscount}}/, storyData.num_comments)
				.replace(/{{ups}}/, shortenLargeNumber(storyData.ups))
				.replace(/{{downs}}/, shortenLargeNumber(storyData.downs));
            listingsHTML += story;
        });
        topStoriesContainer.empty().append(listingsHTML);
    });

})();
