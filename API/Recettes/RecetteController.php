<?php
require("../config.php");

header('Access-Control-Allow-Origin: *');

$action = new RecetteController();

class RecetteController
{

    var $params = array();
    var $url = '';

    public function __construct()
    {
        $this->getParams();
        $this->initialize();
    }

    private function getParams()
    {
        $this->params = file_get_contents("php://input");
        $this->params = json_decode($this->params);
    }

    private function initialize()
    {
        if($this->params->type == "recette"){

            if ($this->params->action == "findAll"){
                $this->findAllRecette();
            }

        }

    }

    /*************************** CRUD **********************************/


    private function findAllRecette()
    {

        $pdo = Database::connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "Select * from omc_recettes";
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);
        Database::disconnect();
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        echo json_encode($data);

    }
    
}