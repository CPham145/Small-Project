<?php
$inData = getRequestInfo();
$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
	$search = trim($inData["Search"]);
	$likeString = "%" . $search . "%";
	$idSearch = is_numeric($search) ? intval($search) : 0;
	// Use LIKE for partial matches
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email 
                            FROM Contacts 
                            WHERE UserID=? 
                            AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ? OR ID=?)");
  //$likeString = "%" . $inData["Search"] . "%"; // <-- partial match
    $stmt->bind_param("issssi", $inData["UserID"], $likeString, $likeString, $likeString, $likeString, $idSearch);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) { $searchResults .= ","; }
        $searchCount++;
        $searchResults .= '{"ID":'.$row["ID"].',"FirstName":"'.$row["FirstName"].'","LastName":"'.$row["LastName"].'","Phone":"'.$row["Phone"].'","Email":"'.$row["Email"].'"}';
    }

    if ($searchCount == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo() { return json_decode(file_get_contents('php://input'), true); }
function sendResultInfoAsJson($obj) { header('Content-type: application/json'); echo $obj; }
function returnWithError($err) { sendResultInfoAsJson('{"results":[],"error":"'.$err.'"}'); }
function returnWithInfo($searchResults) { sendResultInfoAsJson('{"results":['.$searchResults.'],"error":""}'); }
?>
