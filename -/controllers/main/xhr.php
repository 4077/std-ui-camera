<?php namespace std\ui\camera\controllers\main;

class Xhr extends \Controller
{
    public $allow = self::XHR;

    public function close()
    {
        $this->c('~:close|');
    }

    public function setCamera()
    {
        $this->s('~:camera|', $this->data('index'), RR);
    }

    public function capture()
    {
        $this->c('~|')->performCallback('capture', [
            'base64' => $this->data('base64')
        ]);

        $this->close();
    }

    public function loadInstascan()
    {
        $this->js('\plugins\instascan instascan.min');

//        $this->app->response->send(9789);
    }
}
