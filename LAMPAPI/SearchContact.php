<?php

$inData = getRequestInfo();
$userId = isset($inData["UserID"]) ? intval($inData["UserID"]) : 0;

// Check if we're searching by ID or keyword
$isIdSearch = isset($inData["ID"]) && is_numeric($inData["ID"]);

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error)
{
    returnWithError("Database connection failed: " . $conn->connect_error);
}
else
{
    if ($isIdSearch)
    {
        
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone 
                                FROM Contacts WHERE ID=? AND UserID=?");
        $stmt->bind_param("ii", $inData["ID"], $userId);
    }
    else
    {
        
        $search = isset($inData["Search"]) ? "%" . $inData["Search"] . "%" : "%%";
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone 
                                FROM Contacts 
                                WHERE (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?) 
                                AND UserID=?");
        $stmt->bind_param("ssssi", $search, $search, $search, $search, $userId);
    }

    if ($stmt === false)
    {
        returnWithError("SQL prepare failed: " . $conn->error);
        $conn->close();
        exit();
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $searchResults = array();
    while ($row = $result->fetch_assoc())
    {
        $searchResults[] = $row;
    }

    if (count($searchResults) === 0)
    {
        returnWithError("No Records Found");
    }
    else
    {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}

// ---- Helper functions ----

function getRequestInfo()
{
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data === null)
    {
        return array();
    }
    return $data;
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":' . json_encode($searchResults) . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
