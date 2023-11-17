<?php
// Initialize variables for form inputs and result message
$creditCardNumber = $amount = $result = "";
session_start();
// Check if the form has been submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $creditCardNumber = filter_input(INPUT_POST, "creditCardNumber", FILTER_SANITIZE_NUMBER_INT);
    $amount = filter_input(INPUT_POST, "amount", FILTER_SANITIZE_NUMBER_FLOAT);
    $_SESSION['creditCardNumber'] = $creditCardNumber;
    $_SESSION['amount'] = $amount;

    // Validate credit card number (for demonstration purposes, a simple validation is performed here)
    if (strlen($creditCardNumber) == 16 && is_numeric($creditCardNumber) && !empty($amount)) {
        // Perform the transaction and generate a success message
        $result = "Transaction successful! Amount: $$amount charged to credit card ending in " . substr($creditCardNumber, -4);
    } else {
        // Generate an error message if credit card number is invalid
        $result = "Invalid credit card number or amount. Please enter a valid 16-digit number or check if amount is valid.";
    }
    $_SESSION['result'] = $result;
    header("Location: index.php");
    return;
}
?>

<!DOCTYPE html>
<html>

<head>
    <title>Credit Card Transaction</title>
</head>

<body>

    <?php
    $creditCardNumber = isset($_SESSION["creditCardNumber"]) ? $_SESSION["creditCardNumber"] : "";
    $amount = isset($_SESSION["amount"]) ? $_SESSION["amount"] : "";
    if (isset($_SESSION['result'])) {
        $result = $_SESSION['result'];
        unset($_SESSION['result']);
    }
    ?>

    <h2>Credit Card Transaction</h2>
    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        <label for="creditCardNumber">Credit Card Number (16 digits):</label>
        <input type="number" id="creditCardNumber" name="creditCardNumber" autocomplete="cc-number"
            placeholder="xxxx xxxx xxxx xxxx" maxlength="16" required><br><br>
        <label for="amount">Amount ($):</label>
        <input type="text" id="amount" name="amount" required><br><br>
        <input type="submit" value="Submit">
    </form>

    <?php
    // Display the result message if available
    if (!empty($result)) {
        echo "<h3>" . htmlspecialchars($result) . "</h3>";
    }
    ?>
</body>

</html>