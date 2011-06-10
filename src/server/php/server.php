#!/php -q
<?php
  /*  >php -q server.php  */

  error_reporting(E_ALL);
  set_time_limit(0);
  ob_implicit_flush();

  $master = WebSocket("184.106.171.199", 8002);
  $sockets = array($master);
  $users = array();
  $debug = false;

  while (true) {
      $changed = $sockets;
      socket_select($changed, $write = null, $except = null, null);

      foreach ($changed as $socket) {
          if ($socket == $master) {
              $client = socket_accept($master);
              if ($client < 0) {
                  console("socket_accept() failed");
                  continue;
              } //if ($client < 0)
              else {
                  connect($client);
              } //else
          } //if ($socket == $master)
          else {
              $bytes = @socket_recv($socket, $buffer, 2048, 0);
              if ($bytes == 0) {
                  disconnect($socket);
              } //if ($bytes == 0)
              else {
                  $user = getuserbysocket($socket);
                  if (!$user->handshake) {
                      dohandshake($user, $buffer);
                  } //if (!$user->handshake)
                  else {
                      process($user, $buffer);
                  } //else
              } //else
          } //else
      } //foreach ($changed as $socket)
  } //while (true)

  function process($user, $msg)
  {
      $action = unwrap($msg);
      $key = $action[0];

      say("$ < " . $action);

      global $users;

      switch ($key) {
          case 'c':
              broadcast($user, $action);
              break;
          case 'm':
              broadcast($user, $action);
              break;
          case 'd':
              broadcast(null, $action);
              break;
          case 'g':
              send($user->socket, $user->id);
              break;
          case 'a':
              send($user->socket, count($users));
              break;
          case 'u':
              broadcast($user, $action);
              break;
          default:
              // if it is not a specific command then just relay it to all users
              say('Command "' . $action . '" not recognised');
              break;
      } //switch ($key)
  } //function process($user, $msg)

  function broadcast($sender, $message)
  {
      global $users;
      for ($i = 0; $i < count($users); $i++) {
          if ($sender != $users[$i])
              send($users[$i]->socket, $message);
      } //for ($i = 0; $i < count($users); $i++)
  } //function broadcast($sender, $message)

  function send($client, $msg)
  {
      // output the message to the console
      say("$ > " . $msg);

      $msg = wrap($msg);

      socket_write($client, $msg, strlen($msg));
  } //function send($client, $msg)

  function WebSocket($address, $port)
  {
      $master = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) or die("socket_create() failed");

      socket_set_option($master, SOL_SOCKET, SO_REUSEADDR, 1) or die("socket_option() failed");

      socket_bind($master, $address, $port) or die("socket_bind() failed");

      socket_listen($master, 20) or die("socket_listen() failed");

      echo "Server Started : " . date('Y-m-d H:i:s') . "\n";
      echo "Master socket  : " . $master . "\n";
      echo "Listening on   : " . $address . " port " . $port . "\n\n";

      return $master;
  } //function WebSocket($address, $port)

  function connect($socket)
  {
      global $sockets, $users;

      // create a new user.
      $user = new User();
      $user->id = uniqid();
      $user->socket = $socket;

      // push the new user to the users array.
      array_push($users, $user);
      array_push($sockets, $socket);

      say($socket . " CONNECTED!");
      say('User Amount: ' . count($users));
  } //function connect($socket)

  function disconnect($socket)
  {
      global $sockets, $users;
      $found = null;
      $n = count($users);
      for ($i = 0; $i < $n; $i++) {
          if ($users[$i]->socket == $socket) {
              $found = $i;
              break;
          } //if ($users[$i]->socket == $socket)
      } //for ($i = 0; $i < $n; $i++)
      if (!is_null($found)) {
          array_splice($users, $found, 1);
      } //if (!is_null($found))
      $index = array_search($socket, $sockets);
      socket_close($socket);
      console($socket . " DISCONNECTED!");
      if ($index >= 0) {
          array_splice($sockets, $index, 1);
      } //if ($index >= 0)
  } //function disconnect($socket)

  function dohandshake($user, $buffer)
  {
      console("\nRequesting handshake...");
      console($buffer);
      list($resource, $host, $origin, $strkey1, $strkey2, $data) = getheaders($buffer);
      console("Handshaking...");

      $pattern = '/[^\d]*/';
      $replacement = '';
      $numkey1 = preg_replace($pattern, $replacement, $strkey1);
      $numkey2 = preg_replace($pattern, $replacement, $strkey2);

      $pattern = '/[^ ]*/';
      $replacement = '';
      $spaces1 = strlen(preg_replace($pattern, $replacement, $strkey1));
      $spaces2 = strlen(preg_replace($pattern, $replacement, $strkey2));

      if ($spaces1 == 0 || $spaces2 == 0 || $numkey1 % $spaces1 != 0 || $numkey2 % $spaces2 != 0) {
          socket_close($user->socket);
          console('failed');
          return false;
      } //if ($spaces1 == 0 || $spaces2 == 0 || $numkey1 % $spaces1 != 0 || $numkey2 % $spaces2 != 0)

      $ctx = hash_init('md5');
      hash_update($ctx, pack("N", $numkey1 / $spaces1));
      hash_update($ctx, pack("N", $numkey2 / $spaces2));
      hash_update($ctx, $data);
      $hash_data = hash_final($ctx, true);

      $upgrade = "HTTP/1.1 101 WebSocket Protocol Handshake\r\n" . "Upgrade: WebSocket\r\n" . "Connection: Upgrade\r\n" . "Sec-WebSocket-Origin: " . $origin . "\r\n" . "Sec-WebSocket-Location: ws://" . $host . $resource . "\r\n" . "\r\n" . $hash_data;

      socket_write($user->socket, $upgrade . chr(0), strlen($upgrade . chr(0)));
      $user->handshake = true;
      console($upgrade);
      console("Done handshaking...");
      return true;
  } //function dohandshake($user, $buffer)

  function getheaders($req)
  {
      $r = $h = $o = null;
      if (preg_match("/GET (.*) HTTP/", $req, $match)) {
          $r = $match[1];
      } //if (preg_match("/GET (.*) HTTP/", $req, $match))
      if (preg_match("/Host: (.*)\r\n/", $req, $match)) {
          $h = $match[1];
      } //if (preg_match("/Host: (.*)\r\n/", $req, $match))
      if (preg_match("/Origin: (.*)\r\n/", $req, $match)) {
          $o = $match[1];
      } //if (preg_match("/Origin: (.*)\r\n/", $req, $match))
      if (preg_match("/Sec-WebSocket-Key2: (.*)\r\n/", $req, $match)) {
          $key2 = $match[1];
      } //if (preg_match("/Sec-WebSocket-Key2: (.*)\r\n/", $req, $match))
      if (preg_match("/Sec-WebSocket-Key1: (.*)\r\n/", $req, $match)) {
          $key1 = $match[1];
      } //if (preg_match("/Sec-WebSocket-Key1: (.*)\r\n/", $req, $match))
      if (preg_match("/\r\n(.*?)\$/", $req, $match)) {
          $data = $match[1];
      } //if (preg_match("/\r\n(.*?)\$/", $req, $match))
      return array($r, $h, $o, $key1, $key2, $data);
  } //function getheaders($req)

  function getuserbysocket($socket)
  {
      global $users;
      $found = null;
      foreach ($users as $user) {
          if ($user->socket == $socket) {
              $found = $user;
              break;
          } //if ($user->socket == $socket)
      } //foreach ($users as $user)
      return $found;
  } //function getuserbysocket($socket)

  function say($msg = "")
  {
      echo $msg . "\n";
  } //function say($msg = "")
  function wrap($msg = "")
  {
      return chr(0) . $msg . chr(255);
  } //function wrap($msg = "")
  function unwrap($msg = "")
  {
      return substr($msg, 1, strlen($msg) - 2);
  } //function unwrap($msg = "")
  function console($msg = "")
  {
      global $debug;
      if ($debug) {
          echo $msg . "\n";
      } //if ($debug)
  } //function console($msg = "")

  class User
  {
      var $id;
      var $socket;
      var $handshake;
  } //class User
?>