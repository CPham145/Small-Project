<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$inData = getRequestInfo();

$firstName = $inData["FirstName"];
$lastName  = $inData["LastName"];
$login     = $inData["Login"];
$password  = $inData["Password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if login already exists
    $check = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
    $check->bind_param("s", $login);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        returnWithError("Login already exists");
    } else {
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            returnWithInfo($id);
        } else {
            returnWithError("Error inserting user");
        }

        $stmt->close();
    }
    $check->close();
    $conn->close();
}

// ---- Helper Functions ----

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($id)
{
    $retValue = '{"id":' . $id . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
