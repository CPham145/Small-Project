<?php
$inData = getRequestInfo();
$id = $inData["ID"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        returnWithInfo("Contact deleted");
    } else {
        returnWithError("Delete failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo() { return json_decode(file_get_contents('php://input'), true); }
function sendResultInfoAsJson($obj) { header('Content-type: application/json'); echo $obj; }
function returnWithError($err) { sendResultInfoAsJson('{"error":"'.$err.'"}'); }
function returnWithInfo($msg) { sendResultInfoAsJson('{"error":"","message":"'.$msg.'"}'); }
?>
