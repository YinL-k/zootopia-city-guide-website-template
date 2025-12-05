<?php
$correct_user = "admin";
$correct_hash = "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33"; // SHA1("foo")

$user = $_POST["username"] ?? "";
$pass = $_POST["password"] ?? "";
$hash = sha1($pass);

if ($user === $correct_user && $hash === $correct_hash) {
    header("Location: welcome.php");
    exit();
} else {
    echo "Login failed.";
}
?>