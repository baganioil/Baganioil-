<?php
// Bagani AI Chat Proxy — routes requests to Groq API
// API key is injected at deploy time via GitHub Actions secret GROQ_API_KEY

$GROQ_API_KEY = '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';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!$GROQ_API_KEY || $GROQ_API_KEY === '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') {
    http_response_code(500);
    echo json_encode(['error' => 'API key not configured']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$userMessage = trim(substr($body['message'] ?? '', 0, 500));

if (!$userMessage) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty message']);
    exit;
}

$systemPrompt = 'You are Bagani AI, the helpful assistant for Bagani Oil — a premium Filipino lubricants brand made in the Philippines.

Your job:
- Answer questions about Bagani Oil products, usage, and compatibility
- Help customers pick the right oil for their motorcycle or vehicle
- Share info about dealers, availability, and where to buy
- Answer general lubricant/engine oil questions

Bagani Oil product lines:
- AMIHAN (Motorcycle Oils): Amihan 4T Gale 10W-40 (scooters, JASO MB), Amihan 4T Gust SAE 40 (JASO MA), Amihan 4T Tempest 20W-50/20W-40 (JASO MA-2)
- LAON (Engine Oils): Laon Burst 15W-40 (diesel/gasoline, API CI-4/SL), Laon Core SAE 10W/30/40/50 (API CF/SF, heavy duty)
- AMAN (Gear Oils): Aman Deep SAE 90/140 (API GL-4, manual transmissions)
- ANITUN (Transmission Fluids): Anitun DXIII (GM Dexron III ATF)
- HANAN (Gasoline Engine Oils): Hanan Raze 20W-50 (API SL/CF, gasoline engines)

Rules:
- Be friendly, short, and helpful. Use a warm Filipino-friendly tone.
- If asked about pricing, say prices vary by dealer and recommend checking with a local store.
- NEVER make up product specs you are unsure about.
- If the customer needs personalized help, pricing, bulk orders, complaints, or wants to talk to a real person — end your reply with exactly: SUGGEST_MESSENGER
- Do not include SUGGEST_MESSENGER unless genuinely needed.
- Keep replies to 2-4 sentences maximum.';

$payload = json_encode([
    'model' => 'llama-3.1-8b-instant',
    'messages' => [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user', 'content' => $userMessage]
    ],
    'max_tokens' => 300,
    'temperature' => 0.7
]);

$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $GROQ_API_KEY
    ],
    CURLOPT_TIMEOUT => 25,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => 0,
]);

$result = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($result === false) {
    http_response_code(502);
    echo json_encode(['error' => 'AI service unavailable', 'detail' => $curlError]);
    exit;
}

if ($httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['error' => 'AI service unavailable', 'status' => $httpCode]);
    exit;
}

$data = json_decode($result, true);
$reply = trim($data['choices'][0]['message']['content'] ?? '');

$suggestMessenger = strpos($reply, 'SUGGEST_MESSENGER') !== false;
$reply = trim(str_replace('SUGGEST_MESSENGER', '', $reply));

if (!$reply) {
    echo json_encode(['reply' => "Sorry, I couldn't generate a response. Please try again.", 'suggestMessenger' => false]);
    exit;
}

echo json_encode(['reply' => $reply, 'suggestMessenger' => $suggestMessenger]);
