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

            var $canvas = $("canvas", $w);
            var $video = $("video", $w);

            var canvas = $canvas.get(0);
            var video = $video.get(0);
            var button = document.getElementById('button');
            var allow = document.getElementById('allow');
            var context = canvas.getContext('2d');
            var videoStreamUrl = false;

            // функция которая будет выполнена при нажатии на кнопку захвата кадра
            var captureMe = function () {
                if (!videoStreamUrl) {
                    alert('То-ли вы не нажали "разрешить" в верху окна, то-ли что-то не так с вашим видео стримом')
                }
                // переворачиваем canvas зеркально по горизонтали (см. описание внизу статьи)
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                // отрисовываем на канвасе текущий кадр видео
                context.drawImage(video, 0, 0, video.width, video.height);
                // получаем data: url изображения c canvas
                var base64dataUrl = canvas.toDataURL('image/png');
                context.setTransform(1, 0, 0, 1, 0, 0); // убираем все кастомные трансформации canvas
                // на этом этапе можно спокойно отправить  base64dataUrl на сервер и сохранить его там как файл (ну или типа того)
                // но мы добавим эти тестовые снимки в наш пример:
                var img = new Image();
                img.src = base64dataUrl;
                window.document.body.appendChild(img);
            };

            $video.on('mouseup touchend', function () {
                captureMe();

                var base64 = canvas.toDataURL("image/jpeg").substring(22);

                $(".spinner", $w).fadeIn();
                // $video.hide();
                // $canvas.show();

                w.r('capture', {
                    base64: base64
                })
            });

            // $video.on('click', captureMe);

            // navigator.getUserMedia  и   window.URL.createObjectURL (смутные времена браузерных противоречий 2012)
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.URL.createObjectURL = window.URL.createObjectURL || window.URL.webkitCreateObjectURL || window.URL.mozCreateObjectURL || window.URL.msCreateObjectURL;

            // запрашиваем разрешение на доступ к поточному видео камеры
            navigator.getUserMedia({video: true}, function (stream) {
                // разрешение от пользователя получено
                // скрываем подсказку
                // allow.style.display = "none";
                // получаем url поточного видео
                videoStreamUrl = window.URL.createObjectURL(stream);
                // устанавливаем как источник для video
                video.src = videoStreamUrl;

                $video.show();
            }, function () {
                console.log('что-то не так с видеостримом или пользователь запретил его использовать :P');
            });
        }
    });
})(__nodeNs__, __nodeId__);
