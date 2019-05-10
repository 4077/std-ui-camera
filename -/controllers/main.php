<?php namespace std\ui\camera\controllers;

// require \plugins\instascan

class Main extends \Controller
{
    private $s;

    public function __create()
    {
        $this->dmap('|', 'callbacks');

        $this->s = $this->s('|', [
            'camera' => 0
        ]);
    }

    public function performCallback($name, $data = [])
    {
        if ($callback = $this->data('callbacks/' . $name)) {
            $this->_call($callback)->ra($data)->perform();
        }
    }

    public function open()
    {
        $this->app->html->addContainer($this->_nodeId(), $this->view());

        $this->widget(':|', [
            'camera' => $this->s['camera'],
            '.r'     => [
                'close'         => $this->_p('>xhr:close|'),
                'setCamera'     => $this->_p('>xhr:setCamera|'),
                'capture'       => $this->_p('>xhr:capture|'),
                'loadInstascan' => $this->_p('>xhr:loadInstascan|'),
            ]
        ]);
    }

    public function close()
    {
        $this->app->html->removeContainer($this->_nodeId());
    }

    public function reload()
    {
        $this->jquery('|')->replace($this->view());
    }

    private function view()
    {
        $v = $this->v('|');

        $v->assign([
                       'CONTENT' => false
                   ]);

        $this->css();

        return $v;
    }
}
