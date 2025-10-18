<?php

    $inData = getRequestInfo();

    $id = 0;

    $firstName = trim($inData["FirstName"]);
    $lastName  = trim($inData["LastName"]);
    $phone     = trim($inData["Phone"]);
    $email     = trim($inData["Email"]);
    $userId    = $inData["UserID"];

    // ---- Validation checks ----
    if (empty($firstName) || empty($lastName) || empty($phone) || empty($email)) {
        returnWithError("All fields (FirstName, LastName, Phone, Email) are required.");
        exit();
    }

    // Phone: must contain only digits (optional: allow +, -, spaces)
    if (!preg_match("/^[0-9]{10}$/", $phone)) {
        returnWithError("Phone number must contain only digits and be 10 digits long.");
        exit();
    }

    // Email: must be a valid email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        returnWithError("Invalid email format.");
        exit();
    }

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    }
    else {
        $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
        
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            returnWithInfo($id);
        } else {
            returnWithError("Insert failed: " . $stmt->error);
        }

        $stmt->close();
        $conn->close();
    }

    // ---- Helper Functions ----
    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"id":0,"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($id) {
        $retValue = '{"id":' . $id . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
