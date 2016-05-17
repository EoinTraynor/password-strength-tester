<?php
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, `Slim::patch`, and `Slim::delete`
 * is an anonymous function.
 */

// GET route
$app->get('/', function(){
    echo "hello world";
});
//retrieves the collection of sites
$app->get('/stats', 'getStats');
//retrieves the site with the id of '..'
$app->get('stats/:id', 'getStat');
//add a site to the collection
$app->post('/stats', 'addStat');
//delete the site with the id of '..'
$app->delete('/stats/:id', 'deleteStat');

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();

function getStats() {
    // select the contents of the table
    $sql = "SELECT * FROM stats";
    try {
        // tries to connect to the database
        $db = getConnection();
        // query the database
        $stmt = $db->query($sql);
        // devide the table data into PDO objects
        $stats = $stmt->fetchAll(PDO::FETCH_OBJ);
        // close the connection
        $db = null;
        echo '{"site": ' .json_encode($stats) . '}';
    }
    catch(Exception $e){
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }

};

function getStat($id) {
    $sql = "SELECT * FROM stats WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        // attach the passed id to the id query parameter
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $stat = $stmt->fetchObject();
        $db = null;
        echo json_encode($stat);
    }
    catch (Exception $e) {
        echo '{"error":{"text": ' . $e->getMessage() . '}}';
    }
};

function addStat() {
    $request = Slim\Slim::getInstance()->request();
    $stat = json_decode($request->getBody());
    $sql = "INSERT INTO stats (score, complexity, uppercase, lowercase, numbers, symbols, over_eight_char)
            VALUES (:score, :complexity, :uppercase, :lowercase, :numbers, :symbols, :over_eight_char)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("score", $stat->score);
        $stmt->bindParam("complexity", $stat->complexity);
        $stmt->bindParam("uppercase", $stat->uppercase);
        $stmt->bindParam("lowercase", $stat->lowercase);
        $stmt->bindParam("numbers", $stat->numbers);
        $stmt->bindParam("symbols", $stat->symbols);
        $stmt->bindParam("over_eight_char", $stat->over_eight_char);
        $stmt->execute();
        $stat->id = $db->lastInsertId();
        $db = null;
        echo json_encode($stat);
    }
    catch (Exception $e) {
        echo '{"error":{"text": ' . $e . '}}';
    }


};

function deleteStat($id) {
    $sql = "DELETE FROM stats WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
    } catch (Exception $e) {
        echo '{"error":{"text": ' . $e . '}}';
    }

};

function getConnection() {
    $dbhost="127.0.0.1";
    $dbport="8889";
    $dbuser="root";
    $dbpassword="root";
    $dbname="password_stats";

    //try create connection
    try {
        //PDO = php database objects
        $conn = new PDO("mysql:host=$dbhost;port=$dbport;dbname=$dbname", $dbuser, $dbpassword);
        //set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $conn;
    }
    //if unable to establish connection catch the exception
    catch (Exception $e) {
        echo "Connection unsuccessful: " . $e->getMessage();
    }
};
