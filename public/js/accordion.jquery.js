(function($) {
	$.fn.accordion = function(opts) { //constuctor
		var defaults = {
			headings: "h2",
			content: "p",
			callback: function(){},
			duration: 600
		};
	
		var options = $.extend({}, defaults, opts); //merge opts into defaults as a new object 

		return this.each(function(){
			var $this = $(this); //the div that called accordian
			var headings = $this.children(options.headings); //all headings in the div
			var paragraphs = $this.children(options.content); //all paragraphs in the div

			paragraphs.not(":first").hide(); //only runs when script is loaded
			headings.append("<span />"); //insert span element within each heading
			var glyphicons = headings.children("span"); // assign all span elements to a variable
			//following code makes sure that the chevrons look correct when first loading the page
			glyphicons.addClass("glyphicon glyphicon-chevron-down");
			glyphicons.not(":first").removeClass("glyphicon glyphicon-chevron-down");
			glyphicons.not(":first").addClass("glyphicon glyphicon-chevron-up");
			glyphicons.css("float", "right");

			var animateAccordion = function(elem, duration, callback) {
				paragraphs.stop(true, true).slideUp(duration);
				glyphicons.removeClass("glyphicon glyphicon-chevron-down");
				glyphicons.addClass("glyphicon glyphicon-chevron-up");
				$(elem).stop(true, true).slideDown(duration, callback);
			};

			$this.on("click", options.headings, function() {
				var t = $(this); //heading
				var tPara = t.next();
				var tSpan = t.children("span");

				if(!tPara.is(":visible")) {
					tPara.trigger("showParagraph");
					tSpan.removeClass("glyphicon glyphicon-chevron-up")
					tSpan.addClass("glyphicon glyphicon-chevron-down");
				}
			});

			$this.on("showParagraph", options.content, function() {
				animateAccordion(this, options.duration, options.callback);
			});
		});
	};

})(jQuery);
