(function (__nodeNs__, __nodeId__) {
    $.widget(__nodeNs__ + "." + __nodeId__, $.ewma.node, {
        options: {},

        __create: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            w.bind();
        },

        bind: function () {
            var w = this;
            var o = w.options;
            var $w = w.element;

            var $closeButton = $(".close_button", $w);

            $closeButton.click(function () {
                w.r('close');
            });

            //

            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            if (!navigator.getUserMedia) {
                return false;
            }

            var scanner = new Instascan.Scanner({
                video:      $("video", $w).get(0),
                mirror:     false,
                continuous: false
            });

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            var $camera = $(".camera", $w);
            var cameras = [];

            Instascan.Camera.getCameras().then(function (_cameras) {
                cameras = _cameras;

                if (cameras.length > 0) {
                    if (cameras.length > 1) {
                        $camera.find(".camera_icon").show();

                        for (var i in cameras) {
                            i = parseInt(i);

                            var $cameraButton = $("<div></div>");

                            $cameraButton.addClass("camera_button").html(i + 1).attr("index", i).appendTo($camera);

                            if (i == o.camera) {
                                $cameraButton.addClass("current");
                            }

                            $cameraButton.click(function () {
                                setCamera($(this).attr("index"));
                            });
                        }
                    }

                    o.camera = constrains(o.camera, 0, cameras.length - 1);

                    getWebcam();
                } else {
                    $(".error", $w).show();
                }
            }).catch(function (e) {
                console.error(e);
            });

            var setCamera = function (index) {
                o.camera = index;

                $(".camera_button", $w).removeClass("current");
                $(".camera_button[index='" + index + "']", $w).addClass("current");

                w.r('setCamera', {
                    index: o.camera
                });

                if (track) {
                    track.stop();
                }

                getWebcam();
            };

            var $video = $("video", $w);
            var video = $("video", $w).get(0);
            var track;

            $video.on('loadedmetadata', function () {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });

            function getWebcam() {
                navigator.getUserMedia({video: true, audio: false}, function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    track = stream.getTracks()[o.camera];

                    startLoop();
                }, function (e) {
                    console.error('Rejected!', e);
                });
            }

            var loopFrame;

            function loop() {
                loopFrame = requestAnimationFrame(loop);

                ctx.save();

                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

                ctx.restore();
            }

            function startLoop() {
                loopFrame = loopFrame || requestAnimationFrame(loop);
            }

            $video.on('click', function () {
                var base64 = canvas.toDataURL("image/jpeg").substring(22);

                w.r('capture', {
                    base64: base64
                })
            });
        }
    });
})(__nodeNs__, __nodeId__);
