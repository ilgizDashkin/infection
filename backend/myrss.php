<?php header('Access-Control-Allow-Origin: *'); //разрешаем кроссдоменные запросы CORS  ?>
<?php
// $url = "rss.xml";
$url = "https://www.rospotrebnadzor.ru/region/rss/rss.php?rss=y";

function getFeeds($url) {

  $content = file_get_contents($url);
  $items = new SimpleXmlElement($content);
  $json = array();
  $json['rospotreb'] = [];
//   echo "<ul>";

//   foreach($items -> channel -> item as $item) {
//     echo "<li><a href = '{$item->link}' title = '$item->title'>" .
//     $item->title . "</a> - " . $item -> description . "</li>";
//   }

//   echo "</ul>";
  
  foreach($items -> channel -> item as $item) {
     $json['rospotreb'][]= [[$item->title],[$item -> description]];
    }
  echo json_encode($json);
}
  
getFeeds($url)
?>