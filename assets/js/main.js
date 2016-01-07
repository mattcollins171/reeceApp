/*
	Arcana by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {
	var i, path, len, photoName;
	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1280px)',
		narrow: '(max-width: 980px)',
		narrower: '(max-width: 840px)',
		mobile: '(max-width: 736px)',
		mobilep: '(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');
		var path = "";
		
		function alertDismissed() {
		    location.reload();
		}
		$.ajax({
			method: "POST",
			url: "http://rightref.co.uk/jobs/test",
			success: function(result){
		        alert(result);
		    }
		});
		$.ajax({
			method: "POST",
			url: "https://monopoly-run.co.uk/control/api/getPlaces",
			success: function(result){
		        localStorage["places"] = result;
	            var places = JSON.parse(localStorage["places"]);
	            for(x in places){
	                $('#places').append($('<option>', { 
	                        value: places[x].placeID,
	                        text : places[x].placeName
	                }));
	            }
		    }
		});
		$('#login').click(function() {
			$.ajax({
				method: "POST",
				url: "http://rightref.co.uk/jobs/test",
				success: function(result){
			        alert(result);
			    },
			    error: function(jqXHR, textStatus, errorThrown ){
				    alert(textStatus)
			    }
			});
			$.ajax({
				method: "POST",
				url: "https://monopoly-run.co.uk/control/api/controllerLogin",
				data: {
					username:$('#username').val(),
					password:$('#password').val(),
				},
				success: function(result){
					alert(result)
					if(result != -1){
						window.location="checkIn.html";
					}else{
						$('.textBoxError').show();
					}
/*
			        localStorage["username"] = result;
		            var places = JSON.parse(localStorage["places"]);
		            for(x in places){
		                $('#places').append($('<option>', { 
		                        value: places[x].placeID,
		                        text : places[x].placeName
		                }));
		            }
*/
			    },
			    error: function(jqXHR, textStatus, errorThrown ){
				    alert(errorThrown)
			    }
			});
		})
		
		$( "#places" ).change(function() {
			$('#location').button('enable');	
		});
		
		$("#location").click(function() {
			var onSuccess = function(position) {
			    $("#latOutput").html(position.coords.latitude)
			    $("#longOutput").html(position.coords.longitude)
			    $("#lat").val(position.coords.latitude)
			    $("#long").val(position.coords.longitude)
			    $("#positions").show()
			    $('#pic').button('enable');
			};
			
			// onError Callback receives a PositionError object
			//
			function onError(error) {
			    alert('code: '    + error.code    + '\n' +
			          'message: ' + error.message + '\n');
			}
			
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
		});
		
		$("#pic").click(function() {
			$("#loader").hide()
			$("#photo").hide()
			// capture callback
			$('.verification').prop('disabled', true);
			var captureSuccess = function(mediaFiles) {
			    
			    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			        path = mediaFiles[i].fullPath;
					var options = new FileUploadOptions();
					options.fileKey = "file";
					options.fileName = path.substr(path.lastIndexOf('/') + 1);
					photoName = path.substr(path.lastIndexOf('/') + 1);
					options.mimeType = "image/jpeg";
					
					var params = {};
					params.value1 = $('#places option:selected').text();					
					options.params = params;
					$("#loader").show()

					var ft = new FileTransfer();
					ft.upload(path, encodeURI("http://control.monopoly-run.co.uk/upload.php"), win, fail, options);
					
			    }
			};
			
			// capture error callback
			var captureError = function(error) {
			    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
			};
			
			// start image capture
			navigator.device.capture.captureImage(captureSuccess, captureError, {limit:1});
		});
		
		$("#submit").click(function() {
			$(".textBoxError").hide();
			$("#question").removeAttr( 'style' );
			$("#answer").removeAttr( 'style' );


			var error = 0;

			if($("#question").val() == "" ){
				error = 1
				$("#question").css({"background-color": "#f2dede", "border": "1px solid #c7254e"} );
			}
			if($("#answer").val() == ""){
				error = 1
				$("#answer").css({"background-color": "#f2dede", "border": "1px solid #c7254e"} );
			}

			if(error == 1){
				$(".textBoxError").show();
			}else{
				$.ajax({
					method: "POST",
					data: {
						placeID:$('#places option:selected').val(),
						latitude:$('#lat').val(),
						longitude:$('#long').val(),
						question:$('#question').val(),
						answer:$('#answer').val(),
						image:$('#photo').val()
					},
					url: "https://monopoly-run.co.uk/control/api/updatePlaceInfo",
					success: function(result){
						if(result){
							navigator.notification.alert(
							    $('#places option:selected').text()+' has been submitted to the system',  // message
							    alertDismissed,         // callback
							    'All Done!',            // title
							    'OK'                  // buttonName
							);
						}else{
							alert("Slight problem with saving, please try again");
						}
				    }
				});
			}
		});
		
		var win = function (r) {
			$("#uploadedImage").attr("src", path);
			$("#loader").hide()
			$("#photo").show()
		    //set the hidden value for the photo
		    $("#photo").val(photoName)
		    //enable both the Question and Answer text boxes
		    $("#question").removeClass( "ui-disabled" );
		    $("#answer").removeClass( "ui-disabled" );
		    $("#submit").removeClass( "ui-disabled" );
		}
		
		var fail = function (error) {
		    alert("An error has occurred: Code = " + error.code);
		    console.log("upload error source " + error.source);
		    console.log("upload error target " + error.target);
		}
		
		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on narrower.
			skel.on('+narrower -narrower', function() {
				$.prioritize(
					'.important\\28 narrower\\29',
					skel.breakpoint('narrower').active
				);
			});

		// Dropdowns.
			$('#nav > ul').dropotron({
				offsetY: -15,
				hoverDelay: 0,
				alignment: 'center'
			});

		// Off-Canvas Navigation.

			// Title Bar.
				$(
					'<div id="titleBar">' +
// 						'<a href="#navPanel" class="toggle"></a>' +
						'<span class="title">Monopoly Run - Recce</span>' +
					'</div>'
				)
					.appendTo($body);

			// Navigation Panel.
/*
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'navPanel-visible'
					});
*/

			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#titleBar, #navPanel, #page-wrapper')
						.css('transition', 'none');

	});

})(jQuery);