<?php
/**
 * Bagani Website - Contact Form Email Handler
 *
 * Receives form data via POST and sends email to admin.
 * Does NOT open the user's email client.
 *
 * Setup: Update $admin_email to the Bagani company email address.
 */

// -------------------------------------------------------
// CONFIGURATION — Update these values before going live
// -------------------------------------------------------
$admin_email    = 'info@baganioil.com';
$company_name   = 'Bagani';
$email_subject  = 'New Contact Form Message — Bagani Website';
// -------------------------------------------------------

$errorMSG = "";

// Sanitize helper
function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// FIRSTNAME
if (empty($_POST["fname"])) {
    $errorMSG = "First Name is required. ";
} else {
    $fname = sanitize_input($_POST["fname"]);
}

// LASTNAME
if (empty($_POST["lname"])) {
    $errorMSG .= "Last Name is required. ";
} else {
    $lname = sanitize_input($_POST["lname"]);
}

// EMAIL
if (empty($_POST["email"])) {
    $errorMSG .= "Email is required. ";
} else {
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errorMSG .= "Invalid email address. ";
    }
}

// PHONE
if (empty($_POST["phone"])) {
    $errorMSG .= "Phone is required. ";
} else {
    $phone = sanitize_input($_POST["phone"]);
}

// MESSAGE
if (empty($_POST["message"])) {
    $errorMSG .= "Message is required. ";
} else {
    $message = sanitize_input($_POST["message"]);
}

// If validation errors, return error message (used by JS validator)
if ($errorMSG !== "") {
    echo $errorMSG;
    exit;
}

// Build email body
$full_name = $fname . ' ' . $lname;

$Body  = "New contact form submission from the Bagani website.\n\n";
$Body .= "----------------------------------------\n";
$Body .= "Name    : " . $full_name . "\n";
$Body .= "Email   : " . $email . "\n";
$Body .= "Phone   : " . $phone . "\n";
$Body .= "----------------------------------------\n\n";
$Body .= "Message:\n" . $message . "\n\n";
$Body .= "----------------------------------------\n";
$Body .= "Sent from: Bagani Website Contact Form\n";

// Email headers — server sends to admin, Reply-To goes to the visitor
$headers  = "From: Bagani Website <no-reply@baganioil.com>\r\n";
$headers .= "Reply-To: " . $full_name . " <" . $email . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email to admin (NOT opening user's email client)
$success = mail($admin_email, $email_subject, $Body, $headers);

if ($success) {
    echo "success";
} else {
    error_log("Bagani contact form: mail() failed for submission from " . $email);
    echo "Something went wrong — please try again or email us directly at " . $admin_email;
}
?>
