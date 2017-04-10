angularApp.directive("confirmButton", function($document, $parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var buttonId, html, message, nope, title, yep;

            buttonId = Math.floor(Math.random() * 10000000000);

            attrs.buttonId = buttonId;

            message = attrs.message || "¿Está seguro?";
            yep = attrs.yes || "Sí";
            nope = attrs.no || "No";
            title = attrs.title || "<i class='fa fa-question-circle'></i> Confirmación";

            html = "<div style=\"width: 130px;\" id=\"button-" + buttonId + "\">\n  <div class=\"confirmbutton-msg\">" + message + "</div><br><button type=\"button\" class=\"confirmbutton-yes btn btn-success\"><span class=\"fa fa-thumbs-o-up\"></span> " + yep + "</button>\n	<button type=\"button\" class=\"confirmbutton-no btn btn-warning\"><i class=\"fa fa-thumbs-o-down\"></i> " + nope + "</button>\n</div>";

            element.popover({
                content: html,
                html: true,
                trigger: "manual",
                title: title,
                placement: "top"
            });

            return element.bind('click', function(e) {
                var dontBubble, pop;
                dontBubble = true;

                e.stopPropagation();

                element.popover('show');

                pop = $("#button-" + buttonId);

                pop.closest(".popover").click(function(e) {
                    if (dontBubble) {
                        e.stopPropagation();
                    }
                });

                pop.find('.confirmbutton-yes').click(function(e) {
                    dontBubble = false;

                    var func = $parse(attrs.confirmButton);
                    func(scope);
                });

                pop.find('.confirmbutton-no').click(function(e) {
                    dontBubble = false;

                    $document.off('click.confirmbutton.' + buttonId);

                    element.popover('hide');
                });

                $document.on('click.confirmbutton.' + buttonId, ":not(.popover, .popover *)", function() {
                    $document.off('click.confirmbutton.' + buttonId);
                    element.popover('hide');
                });
            });
        }
    };
});
