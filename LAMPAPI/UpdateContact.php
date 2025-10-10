<?php
$inData = getRequestInfo();

$id       = $inData["ID"];
$firstName = trim($inData["FirstName"]);
$lastName  = trim($inData["LastName"]);
$phone     = trim($inData["Phone"]);
$email     = trim($inData["Email"]);

if (!preg_match("/^[0-9]{10}$/", $phone)) {
    returnWithError("Phone number must be exactly 10 digits.");
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    returnWithError("Invalid email format.");
    exit();
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $id);

    if ($stmt->execute()) {
        returnWithInfo("Contact updated");
    } else {
        returnWithError("Update failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo() { return json_decode(file_get_contents('php://input'), true); }
function sendResultInfoAsJson($obj) { header('Content-type: application/json'); echo $obj; }
function returnWithError($err) { sendResultInfoAsJson('{"error":"'.$err.'"}'); }
function returnWithInfo($msg) { sendResultInfoAsJson('{"error":"","message":"'.$msg.'"}'); }
?>
